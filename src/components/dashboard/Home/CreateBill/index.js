import React from "react";
import {
    View,
    TextInput,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    ScrollView,
    Keyboard,
    StatusBar
} from "react-native";
import TextView from "core/TextView";
import { connect } from "react-redux";
import {
    wToDP
} from "common/ResponsiveDimension";

import { appendCustomerPhone, appendCustomerGst, getInitialOrderState } from "common/orderUtils";

import { Ionicons } from "@expo/vector-icons";

import styles from "./styles";

//Spinner
import Spinner from 'core/Spinner'

// actions
import { getCustomerDetails, saveCustomer, addProductToBill, resetCreateOrder } from "./../../../../actions/orderAction";

const rupee = require("./../../../../../assets/images/rupee.png");

@connect((store) => {
    return {
      user: store.auth.user,
      customerDetails: store.orders.customerDetails,
      addedCustomer: store.orders.addedCustomer,
      createBillPayload: store.orders.createBillPayload
    }
})
export default class CreateBill extends React.Component {
    state = {
        phone: null,
        name: null,
        gstin: null,
        showCreateForm: false,
        showCheckForm: true,
        allowNext: false,
        hideSaveButton: false,
        isWaiting:true
    };

    componentDidMount(){
        const { dispatch } = this.props;
        const createOrderInitialState = getInitialOrderState();

        dispatch(addProductToBill(createOrderInitialState));

        dispatch(resetCreateOrder());
        this.setState({isWaiting:false})
    }

    componentDidUpdate = (prevProps) => {
        if(this.props.customerDetails !== prevProps.customerDetails) {
            const { customerDetails } = this.props;
            if (customerDetails[0]) {
                const { phone, gstin, customerOrders, customerType } = customerDetails[0];
    
                const newCustomerPayload = appendCustomerPhone(phone, gstin);
                this.props.dispatch(addProductToBill(newCustomerPayload));
            
                this.setState({
                    allowNext: true,
                    showCheckForm: false,
                    isWaiting: false,
                    gstin,
                    customerOrders,
                    customerType
                })
            }

            if(!customerDetails[0]) {
                this.setState({
                    showCreateForm: true,
                    showCheckForm: false,
                    isWaiting: false
                })
            }
        }

        if(this.props.addedCustomer !== prevProps.addedCustomer) {
            const { phone, gstin } = this.props.addedCustomer;
            const newCustomerPayload = appendCustomerPhone(phone, gstin);
            this.props.dispatch(addProductToBill(newCustomerPayload));
            
            this.setState({
                hideSaveButton: true,
                allowNext: true,
                isWaiting: false
            })
        }
    }

    getCustomer = () => {
        const { phone } = this.state;
        const { user } = this.props;

        const numReg = /^\d+$/;
        var isNum = numReg.test(phone);

        if(!isNum) {
            alert("Please enter valid phone number");
            return;
        }

        this.setState({
            fetchApiCalled: true,
            isWaiting:true
        }, () => {
            this.props.dispatch(getCustomerDetails(phone, user.accessToken)).then(() => {
                this.setState({sWaiting:false})
            });
            Keyboard.dismiss();
        })
    }

    saveCustomer = () => {
        const { name, phone, gstin } = this.state;
        const { user } = this.props;

        const customerPayload = {
            name,
            phone,
            gstin
        }
        
        this.setState({
            isWaiting: true
        }, () => {
            this.props.dispatch(saveCustomer(customerPayload, user.accessToken)).then(() => {
                this.setState({
                    isWaiting: false
                })
            })
        })
    }

    handleInput = (type, value) => {
        const obj = {};
        obj[type] = value;

        this.setState({
            ...obj
        });
    }

    getCustomerTypeColor = (customerType) => {
        return customerType === "DAILY" ? "#1abc9c" 
        : customerType === "REGULAR" ? "#D43D69" : "#e67e22";
    }

    proceed = () => {
        if(this.state.allowNext) {
            const { navigation, route } = this.props;
            const { gstin } = this.state;

            if (this.state.gstin !== null) {
                const newCustomerPayload = appendCustomerGst(gstin);
                this.props.dispatch(addProductToBill(newCustomerPayload));
            }
            
            navigation.navigate("SelectProduct",{
                price: route?.params?.price,
                totalItems : route?.params?.totalItems,
                totalDiscount: route?.params?.totalDiscount
            });
        } else {
            alert("Please select the customer");
        }
    }

    render() {
        const {
            showCreateForm,
            showCheckForm,
            hideSaveButton,
            isWaiting,
            allowNext,
            phone,
            gstin,
            customerOrders,
            customerType
        } = this.state;
        const { route } = this.props;
        return (
            <View style = {styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="#1CBD9C" translucent = {false } />
                {/* {isWaiting &&
                    <Spinner/>
                } */}
                <ScrollView 
                    keyboardShouldPersistTaps = {"always"}
                    contentContainerStyle = {{
                        justifyContent: "center",
                        alignItems: "center",
                        // flex: 1
                    }}>

                    <View style = {[styles.helperTextContainer, { width: wToDP("80%") }]}>
                        <TextView style = {styles.helperText}>
                            {
                                showCreateForm && !hideSaveButton ? 
                                    "Enter customer details and click on save to proceed"
                                : hideSaveButton || !showCheckForm? 
                                    "Click Next to proceed"
                                : null
                            }

                            {
                                showCheckForm ? 
                                    "Enter customer phone number and click on check customer"
                                : null
                            }
                        </TextView>
                    </View>
                    <View style={styles.formController}>
                    {
                        showCreateForm ? (
                            <View style = {{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                <Ionicons name="person" size={30} color={"grey"} style = {{ marginTop: -19, marginRight: 8 }} />
                                <TextInput
                                    style = {[styles.inputWrapper, { borderRadius: 8, width: wToDP("70%") }]}
                                    editable = {hideSaveButton ? false : true}
                                    onChangeText = {this.handleInput.bind(this, "name")}
                                    placeholder = "Full Name"/>
                            </View>
                        ): null
                    }

                    {
                        showCreateForm ? (
                            <View style = {{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                <TextView style = {{ marginTop: -18, fontWeight: "bold", fontSize: 18, width: wToDP("10%") }}>
                                    GST
                                </TextView>
                                <TextInput
                                    style = {[styles.inputWrapper, { borderRadius: 8, width: wToDP("70%") }]}
                                    editable = {hideSaveButton ? false : true}
                                    onChangeText = {this.handleInput.bind(this, "gstin")}
                                    placeholder = "GSTIN (Optional)"/>
                            </View>
                        ): null
                    }

                    <View style = {{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                        <TextView style = {{ marginTop: -18, fontWeight: "bold", fontSize: 18, width: wToDP("10%") }}>
                            +91
                        </TextView>
                        <TextInput
                            style = {[styles.inputWrapper, { borderRadius: 8, width: wToDP("70%") }]}
                            onChangeText = {(value) => {
                                if (value.length > 10) {
                                    return;
                                }

                                const numReg = /^\d+$/;
                                var isNum = numReg.test(value);
                                if (isNum || value.length === 0) {
                                    this.handleInput("phone", value);
                                } else {
                                    if (value.length === 10) {
                                        alert("Please enter valid phone number");
                                    } else {
                                        return;
                                    }
                                }
                            }}
                            editable = {hideSaveButton ? false : true}
                            value = {phone}
                            keyboardType = "number-pad"
                            placeholder = "Customer phone"
                        />
                    </View>

                    {/* if allow next is true */}
                    {
                        allowNext && !showCreateForm ? (
                            <View style = {{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                <TextView style = {{ marginTop: -18, fontWeight: "bold", fontSize: 18, width: wToDP("10%") }}>
                                    GST
                                </TextView>
                                <TextInput
                                    style = {[styles.inputWrapper, { borderRadius: 8, width: wToDP("70%") }]}
                                    editable = {hideSaveButton ? false : true}
                                    value = { gstin }
                                    onChangeText = {this.handleInput.bind(this, "gstin")}
                                    placeholder = "GSTIN (Optional)"/>
                            </View>
                        ): null
                    }

                    {
                        allowNext && !showCreateForm ? (
                            <View style = {{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                <TextView style = {{
                                    marginTop: 20,
                                    fontSize: 20,
                                    color: this.getCustomerTypeColor(customerType)
                                }}>
                                    {
                                        customerType ? customerType+" Customer" : "Visted "+(customerOrders ? customerOrders.count : 0)+" time(s) in last 30 days."
                                    }
                                </TextView>
                            </View>
                        ): null
                    }

                    {
                        showCreateForm && !hideSaveButton ? (
                            <TouchableOpacity 
                                style={[styles.scanContainer, {flexDirection: "row"}]}
                                onPress = {this.saveCustomer}>
                                {
                                    isWaiting ? (
                                        <ActivityIndicator size = "small" color="#fff"/>
                                    ) : null
                                }
                                <TextView style={styles.scanBarText}>{"Save"}</TextView>
                            </TouchableOpacity>
                        ): null
                    }

                    {
                        showCheckForm ? (
                            <TouchableOpacity 
                                style={[styles.scanContainer, {flexDirection: "row"}]}
                                onPress = {this.getCustomer}>
                                {
                                    isWaiting ? (
                                        <ActivityIndicator size = "small" color="#fff"/>
                                    ) : null
                                }
                                <TextView style={styles.scanBarText}>{"Check Customer"}</TextView>
                            </TouchableOpacity>
                        ): null
                    }

                    </View>
                    {/* empty */}
                    <View style = {{
                        height: 20
                    }}>

                    </View>
                </ScrollView>
                <View style={{width:'100%', position:'absolute', justifyContent:'center',bottom:0}}>
                    <View style={{flex:1,flexDirection:'row'}}>
                        <TouchableOpacity style={{flex:1, width: "100%", flexDirection:'column', alignItems:'flex-start', justifyContent:'center', padding:10, backgroundColor:'#20BE9C'}}>
                            <View style = {{flexDirection: "row", alignItems: "center"}}>
                                <Image source = {rupee} style = {{ width: 18, height: 18, marginTop: 2 }}/>
                                <TextView style={{fontSize:18, color:'#fff', fontWeight:'bold'}}>{route?.params?.price || 0}</TextView>
                            </View>
                            <TextView style={{fontSize:12, color:'#fff', fontWeight:'bold', width: "100%"}}>{'Total Amount'}</TextView>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress = {this.proceed}
                            disabled = {!this.state.allowNext}
                            style={{
                                flex:1,
                                flexDirection:'column',
                                alignItems:'center',
                                justifyContent:'center',
                                padding:10,
                                backgroundColor: this.state.allowNext ? '#2E7DB9': "#848484"
                            }}>
                            <TextView style={{fontSize:18, color:'#fff', width:'100%',textAlign:'center',  fontWeight:'bold'}}>{'Next'}</TextView>
                            {/* <TextView style={{fontSize:12, color:'#fff', flex: 1, fontWeight: "bold"}}>
                                {'(' + navigation.getParam('totalItems') + ' Items)'}
                            </TextView> */}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}