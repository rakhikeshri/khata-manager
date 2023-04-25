import React from "react";
import {
    View,
    Image,
    TouchableOpacity,
    Linking,
    ScrollView,
    SafeAreaView,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    StatusBar
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import CheckBox from "expo-checkbox";
import * as Print from 'expo-print';
import TextView from "core/TextView";
import { connect } from "react-redux";
import { getConfig } from "./../../../../../common/AppConfig";
import { updateOrderListForPaymentSettlement } from "./../../../../../common/orderUtils";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";
import { sendMessage, settlePayment } from "./../../../../../actions/orderAction";
import CustomModal, { ModalFooter, ModalButton, ModalContent } from 'react-native-modals';
const successIcon = require("./../../../../../../assets/images/checkmark.png");

@connect((store) => {
    return {
        user: store.auth.user,
        orderList: store.orders.orderList,
        settlePayment: store.orders.settlePayment
    }
})
export default class OrderDetails extends React.Component {
    state = {
        data: this.props.route?.params.order,
        isWaiting:true,
        result:null,
        showWebView:false,
        loaded:false,
        settlementPopup: false,
        settle: {
            amount: "",
            method: "CASH",
            ref: "",
            fullPaid: false,
        },
        printPopup: false
    }

    componentDidMount(){
        this.setState({isWaiting:false})
        const { route } = this.props;
        const data = route?.params.order;

        this.setState({ data });
    }

    componentDidUpdate = (prevProps) => {
        if (this.props.settlePayment !== prevProps.settlePayment) {
            const { settle, data } = this.state;
            const { navigation } = this.props;
            const orderId = data.orderId;

            // update local data
            updateOrderListForPaymentSettlement(orderId, settle);

            this.setState({
                settlementPopup: false,
                settle: {
                    amount: "",
                    method: "CASH",
                    ref: "",
                    fullPaid: false,
                }
            })
        }

        if (this.props.orderList !== prevProps.orderList) {
            const orderId = this.state.data.orderId;
            const updatedOrder = this.getOrder(orderId);
            this.setState({
                data: Object.keys(updatedOrder).length !== 0 ? updatedOrder : this.state.data 
            })
        }
    }

    getOrder = (orderId) => {
        const { orderList } = this.props;
        let order = {};
        for (let i = 0; i < orderList.length ; i++) {
            if (orderList[i].orderId === orderId) {
                order = orderList[i];
            }
        }

        return order;
    }

    sendSMS = () => {
        const data = this.props.route?.params.order || {};
        const { user } = this.props;
        this.props.dispatch(sendMessage(data.orderId, user.accessToken)).then(() => this.setState({isWaiting:false}));
    }

    downloadFile = async (data) => {
        let uri = getConfig("api").host+getConfig("api").root+'/invoices/'+data.orderId ;
        Linking.openURL(uri)
    }

    cancelPrintPopup = () => {
        this.setState({
            printPopup: false
        })
    }

    initiatePrint = () => {
        const { printPopup } = this.state;
        this.setState({
            printPopup: !printPopup
        })
    }

    print = (type, data) => {
        const { orderId } = data;

        let uri = getConfig("api").host+getConfig("api").root+'/invoices/'+orderId+"/"+type ;

        // print
        this.setState({
            printPopup: false
        }, () => {
            Print.printAsync({
                uri
            })
        })
    }

    settle = () => {
        this.setState({
            settlementPopup: true
        })
    }

    closeSettlementPopup = () => {
        this.setState({
            settlementPopup: false
        })
    }

    getPaidAmount = (paymentStages) => {
        let paid = 0;

        for (let i = 0; i< paymentStages.length; i++) {
            const stage = paymentStages[i];
            paid += stage.amount;
        }

        return paid;
    }

    handleSettlementInput = (type, value) => {
        const { settle, data } = this.state;

        settle[type] = value;

        this.setState({ settle: Object.assign({}, settle) });
    }

    settlePayment = () => {
        const { settle, data } = this.state;
        const { dispatch, navigation, user } = this.props;
        const orderId = data.orderId;

        settle.amount = parseFloat(settle.amount);

        dispatch(settlePayment(user.accessToken, orderId, settle));
    }

    render() {
        const { settle, data } = this.state;
        if (!data) {
            return (
                <View>
                    <TextView>
                        error
                    </TextView>
                </View>
            );
        }
    
        const totalItems = data.products.reduce((totalProductItems, product) => {
            return totalProductItems + product.quantity;
        }, 0);

        const paidAmount = this.getPaidAmount(data.paymentStages);

        return (
            <SafeAreaView style = {styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="#1CBD9C" translucent = {false } />
                <View style = {{ 
                    width: "100%",
                    height: 220,
                    flexDirection: "row",
                    paddingLeft: 14,
                    paddingRight: 14,
                }}>
                    <View style = {{
                        width: 80,
                        height: "100%",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <View style = {styles.successIconWrapper}>
                            <Image 
                                source = {successIcon}
                                style = {styles.successIcon}/>
                        </View>
                    </View>
                    <View style = {{ flex: 1, padding: 14 }}>
                        <View style = {{flex:1, flexDirection:'row'}}>
                            <View style = {{flex:1, alignItems:'flex-start'}}>
                                <TextView style = { styles.dataTableHeaderText }>
                                    OrderId
                                </TextView>
                            </View>
                            <View style = {{flex:1, alignItems:'flex-end'}}>
                                <TextView style = { [styles.dataTableDataText, { width: "100%", textAlign: "right"}] }>{data.orderId}</TextView>
                            </View>
                        </View>
                        <View style = {{flex:1, flexDirection:'row'}}>
                            <View style = {{flex:1, alignItems:'flex-start'}}>
                                <TextView style = { styles.dataTableHeaderText }>
                                Customer
                                </TextView>
                            </View>
                            <View style = {{flex:1, alignItems:'flex-end'}}>
                                <TextView style = { [styles.dataTableDataText, { width: "100%", textAlign: "right"}] }>{data.customerId.name}</TextView>
                            </View>
                        </View>
                        <View style = {{flex:1, flexDirection:'row'}}>
                            <View style = {{flex:1, alignItems:'flex-start'}}>
                                <TextView style = { styles.dataTableHeaderText }>
                                Phone
                                </TextView>
                            </View>
                            <View style = {{flex:1, alignItems:'flex-end'}}>
                                <TextView style = { [styles.dataTableDataText, { width: "100%", textAlign: "right"}] }>{data.customerId.phone}</TextView>
                            </View>
                        </View>
                        <View style = {{flex:1, flexDirection:'row'}}>
                            <View style = {{flex:1, alignItems:'flex-start'}}>
                                <TextView style = { styles.dataTableHeaderText }>
                                GSTIN
                                </TextView>
                            </View>
                            <View style = {{flex:1, alignItems:'flex-end'}}>
                                <TextView style = { [styles.dataTableDataText, { width: "100%", textAlign: "right"}] }>{data.customerGst || " - "}</TextView>
                            </View>
                        </View>
                        <View style = {{flex:1, flexDirection:'row'}}>
                            <View style = {{flex:1, alignItems:'flex-start'}}>
                                <TextView style = { styles.dataTableHeaderText }>
                                No. Of Items
                                </TextView>
                            </View>
                            <View style = {{flex:1, alignItems:'flex-end'}}>
                                <TextView style = { [styles.dataTableDataText, { width: "100%", textAlign: "right"}] }>{totalItems}</TextView>
                            </View>
                        </View>
                        <View style = {{flex:1, flexDirection:'row'}}>
                            <View style = {{flex:1,  alignItems:'flex-start'}}>
                                <TextView style = { styles.dataTableHeaderText }>
                                Payment Method
                                </TextView>
                            </View>
                            <View style = {{flex:1, alignItems:'flex-end'}}>
                                <TextView style = { [styles.dataTableDataText, { width: "100%", textAlign: "right"}] }>{data.paymentMethod}</TextView>
                            </View>
                        </View>
                        <View style = {{flex:1, flexDirection:'row'}}>
                            <View style = {{flex:1, alignItems:'flex-start'}}>
                                <TextView style = { styles.dataTableHeaderText }>
                                Payment Ref
                                </TextView>
                            </View>
                            <View style = {{flex:1,  alignItems:'flex-end'}}>
                                <TextView style = { [styles.dataTableDataText, { width: "100%", textAlign: "right"}] }>{data.paymentRefNo}</TextView>
                            </View>
                        </View>
                        <View style = {{flex:1, flexDirection:'row'}}>
                            <View style = {{flex:1, alignItems:'flex-start'}}>
                                <TextView style = { styles.dataTableHeaderText }>
                                Payment Status
                                </TextView>
                            </View>
                            <View style = {{flex:1,  alignItems:'flex-end'}}>
                                <TextView style = { [[styles.dataTableDataText, { width: "100%", textAlign: "right"}], { color: "#d33c6b" }] }>{data.paymentStatus}</TextView>
                            </View>
                        </View>
                        <View style = {{flex:1, flexDirection:'row'}}>
                            <View style = {{flex:1, alignItems:'flex-start'}}>
                                <TextView style = { styles.dataTableHeaderText }>
                                Amount
                                </TextView>
                            </View>
                            <View style = {{flex:1,  alignItems:'flex-end'}}>
                                <TextView style = { [[styles.dataTableDataText, { width: "100%", textAlign: "right"}]] }>{"₹ "+data.totalAmount}</TextView>
                            </View>
                        </View>
                        <View style = {{flex:1, flexDirection:'row'}}>
                            <View style = {{flex:1, alignItems:'flex-start'}}>
                                <TextView style = { styles.dataTableHeaderText }>
                                Paid
                                </TextView>
                            </View>
                            <View style = {{flex:1,  alignItems:'flex-end'}}>
                                <TextView style = { [[styles.dataTableDataText, { width: "100%", textAlign: "right"}]] }>{"₹ "+paidAmount}</TextView>
                            </View>
                        </View>
                    </View>
                </View>
     
                <ScrollView style = {[styles.dataTable, { marginLeft: 20, marginRight: 20 }]}>
                    {
                        data.products.map((product, index) => {
                            return (
                                <View style = {{ width: "100%", flexDirection: "row", backgroundColor: "#f4f6f7", borderRadius: 8, padding: 8, marginTop: 10}}>
                                    <View>
                                        <TextView style = {{ fontSize: 16 }}>
                                            {index+1+"."}
                                        </TextView>
                                    </View>
                                    <View style = {{ marginLeft: 12, width: "100%"}}>
                                        <TextView style = {{ fontSize: 16, fontWeight: "bold", width: "100%" }}>
                                            { product.productId ? product.productId.name: "Unknown" }
                                        </TextView>

                                        <View style = {{ marginLeft: 10, marginRight: 30, flexDirection: "row"}}>
                                            <View style = {{flex: 1}}>
                                                <TextView>
                                                    pid - { product.pid }
                                                </TextView>
                                                <TextView>
                                                    Quantity - {product.quantity}
                                                </TextView>
                                                {
                                                    product.selectedUnit ? (
                                                        <TextView>
                                                            Unit - {product.selectedUnit.label}
                                                        </TextView>
                                                    ): null
                                                }
                                                <TextView>
                                                    SP - {"₹ "+product.sp}
                                                </TextView>
                                            </View>
                                            <View style = {{ flex: 1 }}>
                                                <TextView>
                                                    SGST - {product.sgst+"%"}
                                                </TextView>
                                                <TextView>
                                                    CGST - {product.cgst+"%"}
                                                </TextView> 
                                                <TextView>
                                                    Discount - {product.discount+"%"}
                                                </TextView>
                                                <TextView>    
                                                    Custom Discount - {"₹ "+product.customDiscount}
                                                </TextView>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )
                        })
                    }
                </ScrollView>

                <View style = {styles.actionWrapper}>
                    <TouchableOpacity onPress={this.initiatePrint.bind(this)} style = {[styles.button, {backgroundColor: "#34495e", marginRight: 30}]}>
                        <Ionicons name="md-print" size={24} color={"#fff"} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={(data) => this.sendSMS(data)} style = {[styles.button, {backgroundColor: "#d33b6b", marginRight: 30}]}>
                        <Ionicons name="md-send" size={24} color={"#fff"} />
                    </TouchableOpacity>
                    {
                        data.paymentStatus !== "NONE" ? (
                            <TouchableOpacity onPress={() => this.downloadFile(data)} style = {[
                                styles.button, { backgroundColor: "#317db9", marginRight: data.paymentStatus !== "FULL" ? 30 : 0 }
                            ]}>
                                <Ionicons name="md-download" size={24} color={"#fff"} />
                            </TouchableOpacity>
                        ): null
                    }
                    {
                        data.paymentStatus !== "FULL" ? (
                            <TouchableOpacity onPress={this.settle} style = {[styles.button, {backgroundColor: "#e67f22"}]}>
                                <TextView style = {[styles.buttonText, { fontSize: 28 }]}>
                                ₹
                                </TextView>
                            </TouchableOpacity>
                        ) : null
                    }
                </View>
                {/* Modal popup */}
                <CustomModal
                    visible={this.state.settlementPopup}
                    footer={
                        <ModalFooter>
                            <ModalButton
                                text="Cancel"
                                onPress={ this.closeSettlementPopup }
                                textStyle={{ color: '#fff' }}
                                style={{ backgroundColor: '#317db9' }}
                            />
                            <ModalButton
                                text="Paid"
                                onPress={ this.settlePayment }
                                textStyle={{ color: '#fff' }}
                                style={{ backgroundColor: '#22bf9c' }}
                            />
                        </ModalFooter>
                    }
                >
                    <ModalContent style={styles.scanMoreModalContainer}>
                        <View style = {{
                            width: 300,
                            height: 420
                        }}>
                            <View style = {{ height: 50, flexDirection: "row"}}>
                                <View style = {{ flex: 1 }}>
                                    <TextView style = {{ marginBottom: 8, marginTop: 8 }}>
                                        Paid
                                    </TextView>
                                    <TextView style = {{ fontWeight: "bold", width: "100%", fontSize: 16 }}>
                                        { paidAmount }
                                    </TextView>
                                </View>
                                <View style = {{ flex: 1 }}>
                                    <TextView style = {{ marginBottom: 8, marginTop: 8 }}>
                                        Remaining
                                    </TextView>
                                    <TextView style = {{ fontWeight: "bold", width: "100%", fontSize: 16 }}>
                                        { data.totalAmount - paidAmount }
                                    </TextView>
                                </View>
                            </View>
                            <View style = {{ height: 86, marginTop: 14 }}>
                                <TextView style = {{ marginBottom: 8, marginTop: 8 }}>
                                    Settle
                                </TextView>
                                <TextInput
                                    placeholder = "₹ "
                                    value = {settle.amount.toString()}
                                    onChangeText = { this.handleSettlementInput.bind(this, "amount") }
                                    keyboardType = {"decimal-pad"}
                                    style = {{
                                        flex: 1,
                                        height: 44,
                                        borderWidth: 1,
                                        borderRadius: 8,
                                        padding: 8,
                                        borderColor: "#dedede",
                                        flexDirection: "row",
                                        alignItems: "center"
                                    }}/>
                            </View>
                            <View style = {{ height: 86 }}>
                                <TextView style = {{ marginBottom: 8, marginTop: 12 }}>
                                    Payment Method
                                </TextView>
                                <View style = {{
                                    borderWidth: 1,
                                    borderRadius: 8,
                                    borderColor: "#dedede",
                                }}>
                                    <Picker
                                        selectedValue={settle.method}
                                        onValueChange={this.handleSettlementInput.bind(this, "method")}>

                                        <Picker.Item label="CASH" value="CASH" />
                                        <Picker.Item label="CARD" value="CARD" />
                                        <Picker.Item label="UPI" value="NONE" />
                                    </Picker>
                                </View>
                            </View>
                            <View style = {{ height: 96 }}>
                                <TextView style = {{ marginBottom: 8, marginTop: 16 }}>
                                    Payment Ref(Optional)
                                </TextView>
                                <TextInput
                                    placeholder = "axy1k43"
                                    value = {settle.ref}
                                    onChangeText = { this.handleSettlementInput.bind(this, "ref") }
                                    style = {{
                                        flex: 1,
                                        height: 44,
                                        borderWidth: 1,
                                        borderRadius: 8,
                                        padding: 8,
                                        borderColor: "#dedede",
                                        flexDirection: "row",
                                        alignItems: "center"
                                    }}/>
                            </View>
                            <View style = {{
                                marginTop: 20,
                                flexDirection: "row",
                                alignItems: "center"
                            }}>
                                <TouchableOpacity>
                                    <CheckBox 
                                        value = {settle.fullPaid}
                                        onValueChange = { () => this.handleSettlementInput("fullPaid", !settle.fullPaid) }/>
                                </TouchableOpacity>
                                <TextView style = {{
                                    marginLeft: 8
                                }}>
                                    Close Bill (Full Payment Recomended)
                                </TextView>
                            </View>
                        </View>
                    </ModalContent>
                </CustomModal>

                {/* Print popup */}
                 <CustomModal
                    visible={this.state.printPopup}
                    footer={
                        <ModalFooter>
                            <ModalButton
                                text="Cancel"
                                onPress={ this.cancelPrintPopup }
                                textStyle={{ color: '#fff' }}
                                style={{ backgroundColor: '#317db9', marginTop: 2}}
                            />
                        </ModalFooter>
                    }
                >
                    <ModalContent style={styles.scanMoreModalContainer}>
                        <View style = {{
                            width: 300,
                            height: 150
                        }}>

                            <TouchableOpacity 
                                onPress = { this.print.bind(this, "a4", data)}    
                                style = {{
                                    width: "100%",
                                    height: 48,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    backgroundColor: "#f0f2f4",
                                    borderRadius: 8,
                                }}>
                                <TextView style = {{
                                    fontSize: 18
                                }}>
                                    Print A4 Invoice
                                </TextView>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                onPress = { this.print.bind(this, "pos", data)}
                                style = {{
                                    width: "100%",
                                    height: 48,
                                    marginTop: 18,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    backgroundColor: "#f0f2f4",
                                    borderRadius: 8,
                                }}>
                                <TextView style = {{
                                    fontSize: 18
                                }}>
                                    Print POS Invoice
                                </TextView>
                            </TouchableOpacity>
                        </View>
                    </ModalContent>
                </CustomModal>
            </SafeAreaView>
        )
    }
}