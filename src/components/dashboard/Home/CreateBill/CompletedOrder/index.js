import React from "react";
import {
    View,
    TouchableOpacity,
    Modal,
    ActivityIndicator,
    StatusBar
} from "react-native";
import CheckBox from "expo-checkbox";
import TextView from "core/TextView";
import { connect } from "react-redux";
import * as Print from 'expo-print';
import CustomModal, { ModalFooter, ModalButton, ModalContent } from 'react-native-modals';

import styles from "./styles";

import { Ionicons } from "@expo/vector-icons";
import { getConfig } from "./../../../../../common/AppConfig";
import { resetStackNavigationTo } from "./../../../../../common/utils";
import { getInitialOrderState } from "./../../../../../common/orderUtils";
import Spinner from '../../../../core/Spinner'

import { resetCreateOrder, addProductToBill, sendMessage } from "./../../../../../actions/orderAction";

@connect((store) => {
    return {
      user: store.auth.user,
      createBillPayload: store.orders.createBillPayload,
      createOrder: store.orders.createOrder,
      sendSms: store.orders.sendSms
    }
})
export default class Success extends React.Component {
    state = {
        isWaiting:true,
        sendInvoice: true,
        statusText: "Redirecting...",
        event: null,
        sendingInvoice: false,
        printPopup: false
    }

    componentDidMount(){
        this.setState({isWaiting:false})
    }

    componentDidUpdate = (prevProps) => {
        if (this.props.sendSms !== prevProps.sendSms) {
            this.setState({
                statusText: "Redirecting...",
                sendInvoice: false,
                sendingInvoice: false
            }, () => {
                this.state.event();
            })
        }
    }

    handleCheck = () => {
        const { sendInvoice } = this.state;

        this.setState({
            sendInvoice: !sendInvoice
        })
    }

    goToOrders = () => {
        const { navigation, dispatch } = this.props;

        const createOrderInitialState = getInitialOrderState();

        dispatch(addProductToBill(createOrderInitialState));

        dispatch(resetCreateOrder());

        // reset and navigate to dashboard
        resetStackNavigationTo(navigation, [
            { name: 'Dashboard' },
            { name: 'Orders' }
        ], 1, true);
    }

    createNewOrder = () => {
        const { navigation, dispatch } = this.props;

        const createOrderInitialState = getInitialOrderState();

        dispatch(addProductToBill(createOrderInitialState));

        dispatch(resetCreateOrder());

        // reset and navigate to dashboard
        resetStackNavigationTo(navigation, [
            { name: 'Dashboard' },
            { name: 'CreateBill' }
        ], 1, true);
    }

    sendInvoice = () => {
        const { user, dispatch, createOrder } = this.props;
        const { orderId } = createOrder;
        
        dispatch(sendMessage(orderId, user.accessToken));
    }

    handleRedirection = (type) => {
        let event = null;
        if (type === "orders") {
            event = this.goToOrders;
        } else {
            event = this.createNewOrder;
        }

        const { sendInvoice } = this.state;
        let sendingInvoice = false;
        let statusText = this.state.statusText;
        if (sendInvoice) {
            sendingInvoice = true;
            statusText = "Sending invoice to customer";

            this.setState({ 
                event,
                sendingInvoice,
                statusText
            }, () => {
                this.sendInvoice();
            });
        } else {
            event();
        }
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

    print = (type,) => {
        const { createOrder } = this.props;
        const { orderId } = createOrder;

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

    render() {
        const { createOrder } = this.props;
        const { orderId } = createOrder;
        const { isWaiting, sendInvoice, statusText, sendingInvoice } = this.state;
        
        return (
            <View style = {styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="#1CBD9C" translucent = {false } />
                {isWaiting && <Spinner/>}
                <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                    <View style={{width:130, height:130, borderRadius:100, backgroundColor:'#20be9c', alignItems:'center', justifyContent:'center'}}>
                        <Ionicons name="md-checkmark" size={80} color={"#fff"} />
                    </View>
                    <View style={{alignItems:'center', justifyContent:'center', marginTop: 54}}>
                        <TextView style={{color:'#848484', fontSize:20}}>{'Bill Generated Successfully'}</TextView>
                    </View>
                    <View style={{alignItems:'center', justifyContent:'space-between', margin:30, flexDirection:'row'}}>
                        <TextView style={{color:'#000', fontWeight:'bold', fontSize:20, margin:10}}>{'Invoice Id'}</TextView>
                        <TextView style={{color:'#000', fontWeight:'bold', fontSize:20, margin:15}}>{orderId}</TextView>
                    </View>

                    <View style = {{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                        <CheckBox
                            value={sendInvoice}
                            onValueChange={() => this.handleCheck()} />
                        <TextView>Send invoice to customer</TextView>
                    </View>

                    <TouchableOpacity 
                        onPress={this.initiatePrint.bind(this)}
                        style = {[styles.button, {backgroundColor: "#1dbd9c", marginTop: 54}]}>
                        <TextView style = {styles.buttonText}>
                            Print Invoice
                        </TextView>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress = {this.handleRedirection.bind(this, "newOrder")}
                        style = {[styles.button, {backgroundColor: "#2980b9", marginTop: 54}]}>
                        <TextView style = {styles.buttonText}>
                            Create New
                        </TextView>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress = {this.handleRedirection.bind(this, "orders")}
                        style = {[styles.button, {backgroundColor: "#d33b6b", marginTop: 16}]}>
                        <TextView style = {styles.buttonText}>
                            Go To Orders
                        </TextView>
                    </TouchableOpacity>
                </View>
                <Modal visible = {sendingInvoice} transparent = {true}>
                    <View style = {{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.4)"}}>
                        <View style = {{ 
                            flexDirection: "row",
                            width: "80%",
                            height: 80,
                            backgroundColor: "#fff",
                            borderRadius: 8,
                            alignItems: "center",
                            paddingLeft: 24,
                            paddingRight: 24
                        }}>
                            <ActivityIndicator size="large" color="#20be9c" />
                            <TextView style = {{ marginLeft: 14, fontSize: 16}}>
                                { statusText }
                            </TextView>
                        </View>
                    </View>
                </Modal>

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
                                onPress = { this.print.bind(this, "a4")}    
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
                                onPress = { this.print.bind(this, "pos")}
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
            </View>
        )
    }
}