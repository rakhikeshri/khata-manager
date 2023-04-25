import React from "react";
import { connect } from "react-redux";
import {
    StatusBar,
    View,
    FlatList,
    RefreshControl,
    TouchableOpacity,
    Linking,
    Alert
} from "react-native";

import TextView from "core/TextView";

// actions
import { getUnsettledCustomers } from "./../../../../../actions/reportActions";
import { requestSettlement } from "./../../../../../actions/orderAction";

import styles from "./styles";

@connect((store) => {
  return {
    user: store.auth.user,
    unsettledCustomers: store.report.unsettledCustomers
  }
})
export default class Settlement extends React.Component {

    state = {
        isWaiting: true,
        unsettledCustomers: []
    }

    componentWillMount = () => {
        this.load()
    }

    load = () => {
        const { user, dispatch } = this.props;
        this.setState({
            isWaiting: true
        }, () => {
            dispatch(
                getUnsettledCustomers(user.accessToken)
            ).then(() => 
                this.setState({ 
                    isWaiting: false,
                    unsettledCustomers: this.props.unsettledCustomers
                }));
        });
    }

    getUnsettledAmount(o) {
        let unsettledValue = 0;
        for (let i = 0; i < o.length; i++) {
            const order = o[i];
            const orderTotal = order.totalAmount;
            const totalPaidForOrder = order.paymentStages
                                        .map(stage => stage.amount)
                                        .reduce((prev, current) => prev + current);
            unsettledValue += (orderTotal - totalPaidForOrder);
        }

        return unsettledValue;
    }

    request = (item, totalSettlement) => {
        const { user, dispatch } = this.props;
        const { _id, phone, name } = item;
        dispatch(requestSettlement(_id, phone, user.accessToken)).then(() => {
            Alert.alert(
                "Settlement",
                "A settlement request of Rs "+totalSettlement+" has been sent via SMS to Mr. "+name+".",
                [
                  { text: "OK" }
                ]
            );
        })
    }

    navigateToOrders = (item) => {
        const { navigation } = this.props;

        navigation.navigate("Orders", {
            orders: item.customerOrders
        });
    }

    render() {
        const { unsettledCustomers, isWaiting } = this.state;
        return (
            <View style = {styles.contentContainer}>
                <StatusBar barStyle="dark-content" backgroundColor="#1CBD9C" translucent = {false } />
                <FlatList
                    refreshControl={
                        <RefreshControl
                            refreshing={isWaiting}
                            onRefresh={() => this.load()}
                            tintColor={'grey'}
                        />
                    }
                    data = {unsettledCustomers}
                    renderItem = {({item}) => {
                        const totalSettlement = this.getUnsettledAmount(item.customerOrders);
                        return (
                            <View style = {{ borderRadius: 8, marginTop: 16, elevation: 2 }}>
                                <View style = {{
                                    width: "100%",
                                    backgroundColor: "#f4f6f7",
                                    height: 90,
                                    borderTopRightRadius: 8,
                                    borderTopLeftRadius: 8,
                                    alignItems: "center",
                                    paddingLeft: 10,
                                    paddingRight: 10,
                                    paddingTop: 10,
                                    alignItems: "flex-start",
                                    flexDirection: "row",
                                }}>
                                    <View style = {{ flex: 1 }}>
                                        <TextView
                                            style = {{
                                                fontSize: 16,
                                                fontWeight: "bold",
                                            }}
                                        >
                                            { item.name }
                                        </TextView>
                                        <TextView
                                            style = {{
                                                fontSize: 14,
                                                marginTop: 4
                                            }}
                                        >
                                            { item.phone }
                                        </TextView>
                                    </View>
                                    <View style = {{alignItems: "flex-end"}}>
                                        <TextView
                                            style = {{
                                                fontSize: 20,
                                                fontWeight: "bold",
                                                color: "#D53D69"
                                            }}
                                        >
                                            ₹ { totalSettlement }
                                        </TextView>
                                        <TextView
                                            style = {{
                                                fontSize: 14,
                                            }}
                                        >
                                            Unsettled
                                        </TextView>
                                    </View>
                                </View>
                                <View style = {{
                                    height: 50,
                                    width: "100%",
                                    backgroundColor: "#278CBE",
                                    borderBottomLeftRadius: 8,
                                    borderBottomRightRadius: 8,
                                    flexDirection: "row"
                                }}>
                                    <TouchableOpacity 
                                        onPress={() => Linking.openURL(`tel:${item.phone}`)}
                                        style = {{
                                            flex: 1,
                                            justifyContent: "center",
                                            alignItems: "center",
                                            backgroundColor: "#278CBE",
                                            borderBottomLeftRadius: 8,
                                            fontWeight: "bold",
                                            fontSize: 14
                                        }}
                                    >
                                        <TextView style = {{ color: "#fff" }}>
                                            Call
                                        </TextView>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={this.navigateToOrders.bind(this, item)}
                                        style = {{ 
                                            flex: 1,
                                            justifyContent: "center",
                                            alignItems: "center",
                                            backgroundColor: "#E67C23",
                                            fontWeight: "bold",
                                            fontSize: 14
                                        }}
                                    >
                                        <TextView style = {{ color: "#fff" }}>
                                            Orders
                                        </TextView>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        onPress={this.request.bind(this, item, totalSettlement)}
                                        style = {{ 
                                            flex: 1,
                                            justifyContent: "center",
                                            alignItems: "center",
                                            backgroundColor: "#D53D69",
                                            borderBottomRightRadius: 8,
                                            fontWeight: "bold",
                                            fontSize: 14
                                        }}
                                    >
                                        <TextView style = {{ color: "#fff" }}>
                                            Request
                                        </TextView>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )
                    }}
                    keyExtractor = {item => item.pid}
                    onEndReachedThreshold = {0.5}
                    onEndReached = {() => {
                        // const { pageInfo, pageLoading } = this.state;
                        // if (pageLoading || productList.length < 10) {
                        //     return;
                        // }

                        // this.setState({
                        //     pageLoading: true,
                        //     pageInfo: {
                        //         ...pageInfo,
                        //         page: pageInfo.page + 1
                        //     }
                        // })
                    }}
                    scrollEventThrottle = {600}
                    ListFooterComponent = {() => {
                        const { pageLoading } = this.state;
                        if (!pageLoading) return null;
                    
                        return <ActivityIndicator style={{ color: "#000" }} size = "large"/>;
                    }}
                />
            </View>
        )
    }
}