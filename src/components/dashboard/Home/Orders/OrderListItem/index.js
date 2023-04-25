import React from "react";
import {
    View,
    Animated,
    TouchableOpacity
} from "react-native";
import Swipeable from 'react-native-gesture-handler/Swipeable';
import TextView from "core/TextView";
import { Ionicons } from "@expo/vector-icons";

// actions
import { deleteOrder } from "./../../../../../actions/orderAction";

import styles from "./styles";

export default class OrderListItem extends React.Component {
    month = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ];
    getParsedDate = (d) => {
        let date = d.getDate();
        date = date.toString().length < 2 ? "0"+date : date;
        const month = this.month[d.getMonth()];
        const year = d.getFullYear();

        let s = "AM";

        let hrs = d.getHours();
        let mins = d.getMinutes();

        if(hrs > 12) {
            hrs = Math.abs(12 - hrs);
            s = "PM";
        }

        hrs = hrs.toString().length < 2 ? "0"+hrs : hrs;
        mins = mins.toString().length < 2 ? "0"+mins : mins;

        return hrs+":"+mins+" "+s+" "+date+" "+month+" "+year;
    }

    openOrderDetails = () => {
        const { navigation, data } = this.props;
        navigation.navigate("OrderDetails", {
            order: data
        });
    }

    swipeRight = (progress, dragX) =>{
        const { data } = this.props;
        const scale = dragX.interpolate({
          inputRange:[-200, 0],
          outputRange:[1, 0.5],
          extrapolate:'clamp'
        });

        return(
          <Animated.View style={{
              backgroundColor:'#D53D69',
              width: 100,
              marginTop: 10,
              marginBottom: 10,
              justifyContent:'center',
              borderRadius: 8,
            }}>
                <TouchableOpacity onPress={this.removeItem.bind(this, data._id)} style={{alignItems:'center', justifyContent:'center'}}>
                    <Ionicons name="md-trash" size={28} color={"#fff"} />
                </TouchableOpacity>
          </Animated.View>
        )
    }

    removeItem(id) {
        const { user, dispatch, deletedOrder } = this.props;
        deletedOrder(id);
        dispatch(deleteOrder(id, user.accessToken));
    }

    render() {
        const { data } = this.props;
        const createdDate = new Date(data.createdAt);
        const totalItems = data.products.reduce((totalProductItems, product) => {
            return totalProductItems + product.quantity;
        }, 0);

        return(
            <Swipeable renderRightActions={this.swipeRight} rightThreshold={-200}>
                <TouchableOpacity 
                    onPress = { this.openOrderDetails }
                    style = {styles.container}>
                    <View style = {styles.column}>
                        <TextView style = {styles.numberOfItems}>
                            {totalItems+" Items"}
                        </TextView>
                        <TextView style = {styles.orderId}>{"Order Id - "+data.orderId}</TextView>
                        <TextView style = {styles.customerName}>{data.customerId.name}</TextView>
                        <TextView style = {styles.phone} >{data.customerId.phone}</TextView>
                        {
                            data.customerGst ? (
                                <TextView style = {styles.customerGst}>{"GSTIN - "+data.customerGst}</TextView>
                            ): null
                        }
                    </View>
                    <View style = {[styles.column, styles.rightAlign]}>
                        <TextView style = {styles.orderTime}>{this.getParsedDate(createdDate)}</TextView>
                        <View style = {{ flexDirection: "row" }}>
                            <TextView style = {{ fontSize: 18, marginTop: 8}}>{"₹"}</TextView>
                            <TextView style = {styles.totalAmount}>{data.totalAmount}</TextView>
                        </View>
                        <View>
                            <TextView style = {[
                                styles.paymentStatus,
                                {
                                    color: data.paymentStatus === "FULL" ? "#20BC9B" : "#D53D69",
                                    fontWeight: "bold",
                                    width : 80,
                                    textAlign: "right"
                                }
                            ]}>{data.paymentStatus}</TextView>
                        </View>
                        <View>
                            <TextView style = {styles.paymentMethod}>
                                {data.paymentMethod}
                            </TextView>
                        </View>
                    </View>
                </TouchableOpacity>
            </Swipeable>
        )
    }
}