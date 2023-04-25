import React from "react";
import {
    View,
    TextInput,
    TouchableOpacity,
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import TextView from "core/TextView";
import { connect } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

import styles from "./styles";
import Spinner from '../../../../core/Spinner'
import { wToDP } from "../../../../../common/ResponsiveDimension";

const rupee = require("./../../../../../../assets/images/rupee.png");

@connect((store) => {
    return {
      user: store.auth.user,
      createBillPayload: store.orders.createBillPayload,
      createOrder: store.orders.createOrder
    }
})
export default class PaymentMethod extends React.Component {
    state = {
        paymentStatus: "FULL",
        paymentMethod: "CASH",
        paymentRefNo: "",
        isWaiting:true,
        paymentStages: [
            {
                amount: "",
                method: "CASH",
                ref: ""
            }
        ]
    }

    componentDidMount(){
        this.setState({isWaiting:false});
        const { paymentStages } = this.state;
        const { route } = this.props;

        const price = route?.params.price;
        const totalDiscount = route?.params.totalDiscount;
        const stage = paymentStages[0];
        stage.amount = parseFloat(price);

        paymentStages[0] = Object.assign({}, stage);

        const newPaymentStage = Object.assign([], paymentStages);

        this.setState({
            paymentStages: newPaymentStage
        })
    }

    handleInput = (type, value) => {
        const obj = {};
        obj[type] = value;

        this.setState(obj);
    }

    savePaymentMethod = () => {
        const { navigation, route } = this.props;
        const { paymentStages, paymentStatus } = this.state;
        
        navigation.navigate('Checkout', {
            paymentStages: paymentStages,
            paymentStatus: paymentStatus,
            totalItems : route?.params.totalItems
        })
    }

    updatePaymentStatus = (value) => {  
        const paymentStatus = value;

        this.setState({ paymentStatus });
    }

    addPaymentStage = () => {
        const { paymentStages } = this.state;
        paymentStages.push({
            amount: "",
            method: "CASH",
            ref: ""
        });

        this.setState({
            paymentStages
        })
    }

    updatePaymentStage = (index, key, value) => {
        const { paymentStages, paymentStatus } = this.state;

        if (key === "amount" && paymentStatus === "PARTIAL") {
            const valid = this.validateAmount(index, value);

            if (!valid) {
                alert("Sum of partial amounts cannot be more than total bill amount!");
                return;
            }
        }

        const stage = Object.assign({}, paymentStages[index]);
        stage[key] = value;

        paymentStages[index] = Object.assign({}, stage);

        const newPaymentStage = Object.assign([], paymentStages);

        this.setState({ paymentStages: newPaymentStage });
    }

    removePaymentStage = (index) => {
        const { paymentStages } = this.state;
        
        if(paymentStages.length === 1) {
            return;
        }

        paymentStages.splice(index, 1);

        this.setState({ paymentStages });
    }

    validateAmount = (index, newAmount) => {
        const { route } = this.props;
        const { paymentStages } = this.state;
        let valid = true;
        let amountCounter = 0;

        for (let i = 0; i < paymentStages.length ; i++) {
            if (index !== i) {
                const stage = paymentStages[i];
                amountCounter += parseFloat(stage.amount);
            }
        }

        const price = route?.params.price;

        amountCounter += parseFloat(newAmount);

        if (amountCounter > price) {
            valid = false;
        }

        return valid;
    }

    render() {
        const { paymentStages, paymentStatus } = this.state;
        const { route } = this.props;

        return (
        <SafeAreaView style = {styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#1CBD9C" translucent = {false } />
            <ScrollView contentContainerStyle = {{
                paddingLeft: 24,
                paddingRight: 24,
                alignItems: "center"
            }}>
                <View style = {[styles.helperTextContainer, {width : wToDP("80%")}]}>
                    <TextView style = {styles.helperText}>
                        {'Enter payment method and click next to proceed'}
                    </TextView>
                </View>
                <View style = {[styles.inputWrapper, {width: wToDP("90%")}]}>
                    <Picker
                        selectedValue={this.state.paymentStatus}
                        style={{
                            width: "100%",
                            height : 50,
                            borderRadius: 8,
                            fontSize: 16,
                            padding: 8,
                            color:'#000',
                            fontWeight:'bold'
                        }}
                        onValueChange={this.updatePaymentStatus.bind(this)}>
                        <Picker.Item label="FULL" value="FULL" />
                        <Picker.Item label="PARTIAL" value="PARTIAL" />
                        <Picker.Item label="NONE" value="NONE" />
                    </Picker>
                </View>
                    {/* Payment inputs */}
                    {
                        paymentStatus !== "NONE" && paymentStages.map((paymentStage, index) => {
                            return (
                                <View key = {"payment_stage_create_bill_"+index} style = {{ flex : 1, flexDirection: "row", backgroundColor: "#f4f6f7", padding: 12, borderRadius: 8, marginTop: 10 }}>
                                    {
                                        paymentStages.length !== 1 ? (
                                            <View style = {{ width: 40, justifyContent: "center", alignItems: "center", marginLeft: -10 }}>
                                                <TextView>
                                                    { index+1+"." }
                                                </TextView>
                                            </View>
                                        ) : null
                                    }
                
                                    <View style = {{ flex: 1, paddingRight: 4 }}>
                                        {
                                            paymentStatus !== "FULL" ? (
                                                <TextInput
                                                    style = {[styles.inputWrapper, { width: "100%", height: 44, marginBottom: 10, fontSize: 16 }]}
                                                    onChangeText = {this.updatePaymentStage.bind(this, index, "amount")}
                                                    keyboardType = {"decimal-pad"}
                                                    value = { typeof paymentStage.amount !== "string" ? paymentStage.amount.toString() : paymentStage.amount }
                                                    placeholder = "Payment Amount"/>
                                            ) : null
                                        }
                                        <View style = {[styles.inputWrapper, { width: "100%",height: 44, marginBottom: 10 }]}>
                                            <Picker
                                                selectedValue={paymentStage.method}
                                                style={{
                                                    width: "100%",
                                                    height : 44,
                                                    borderRadius: 8,
                                                    fontSize: 16,
                                                    padding: 8,
                                                    color:'#000',
                                                    fontWeight:'bold'
                                                }}
                                                onValueChange={this.updatePaymentStage.bind(this, index, "method")}>
                                                <Picker.Item label="CASH" value="CASH" />
                                                <Picker.Item label="CARD" value="CARD" />
                                                <Picker.Item label="UPI" value="UPI" />
                                            </Picker>
                                        </View>
                                        <TextInput
                                            style = {[styles.inputWrapper, { width: "100%", height: 44, marginBottom: 0, fontSize: 16 }]}
                                            onChangeText = {this.updatePaymentStage.bind(this, index, "ref")}
                                            value = { paymentStage.ref }
                                            placeholder = "Payment Ref No.(Optional)"/>
                                    </View>
                                    {
                                        paymentStages.length !== 1 ? (
                                            <TouchableOpacity 
                                                onPress = { this.removePaymentStage.bind(this, index) }
                                                style = {{ width: 60, justifyContent: "center", alignItems: "center", marginRight: -8 }}>
                                                <Ionicons name="md-trash" size={36} color={"#d6dade"} />
                                            </TouchableOpacity>
                                        ): null
                                    }
                                </View>
                            );
                        })
                    }
                    {/* // */}

                    {
                        paymentStatus === "PARTIAL" ? (
                            <View style = {{ marginTop: 30 }}>
                                <TouchableOpacity 
                                    onPress = { this.addPaymentStage }
                                    style = {{ 
                                        alignSelf: "flex-end",
                                        width: 140,
                                        height: 40,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        backgroundColor: "#d33b6b",
                                        borderRadius: 8,
                                    }}>
                                    <TextView style = {{ color: "#fff" }}>
                                        + Add More
                                    </TextView>
                                </TouchableOpacity>
                            </View>
                        ) : null
                    }
                    {/* empty */}
                    <View style = {{ height: 100 }}></View>
                </ScrollView>
                <View style={{width:'100%', position:'absolute', justifyContent:'center',bottom:0}}>
                    <View style={{flex:1,flexDirection:'row'}}>
                        <TouchableOpacity style={{flex:1, flexDirection:'column', alignItems:'flex-start', justifyContent:'center', padding:10, backgroundColor:'#20BE9C'}}>
                            <View style = {{flexDirection: "row", alignItems: "center"}}>
                                <Image source = {rupee} style = {{ width: 18, height: 18, marginTop: 2 }}/>
                                <TextView style={{fontSize:18, color:'#fff', fontWeight:'bold'}}>{route?.params.price}</TextView>
                            </View>
                            <TextView style={{fontSize:12, color:'#fff', fontWeight:'bold', width: "100%"}}>{'Total Amount'}</TextView>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress = {this.savePaymentMethod}
                            style={{
                                flex:1,
                                flexDirection:'column',
                                alignItems:'center',
                                justifyContent:'center',
                                padding:10,
                                backgroundColor: '#2E7DB9'
                            }}>
                            <TextView style={{fontSize:18, color:'#fff', width:'100%',textAlign:'center',  fontWeight:'bold'}}>{'Next'}</TextView>
                            <TextView style={{fontSize:12, color:'#fff', flex: 1,fontWeight: "bold"}}>
                                {'(' + route?.params.totalItems + ' Items)'}
                            </TextView>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}