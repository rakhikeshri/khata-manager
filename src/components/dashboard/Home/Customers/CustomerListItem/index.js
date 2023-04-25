import React from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Linking,
} from "react-native";
import TextView from "core/TextView";

import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";

const maleIcon = require("./../../../../../../assets/images/gender-male.png");
const femaleIcon = require("./../../../../../../assets/images/gender-female.png");

export default class CustomerListItem extends React.Component {
    render() {
        const { data } = this.props;

        return (
            <View style = {styles.ItemWrapper}>
                <View style = {styles.customerInfoRow}>
                    <View style = {styles.dataColumn}>
                        <TextView style = {styles.customerNameText}>{data.name}</TextView>
                        {
                            data.email ? (
                                <TextView>{data.email}</TextView>
                            ): null
                        }
                        <TextView  style = {styles.customerPhoneText}>{data.phone}</TextView>
                        <TextView  style = {[
                            styles.customerType,
                            data.customerType === "DAILY" ? { color: "#1abc9c" } : {},
                            data.customerType === "REGULAR" ? { color: "#D43D69" } : {},
                        ]}>
                            {
                                data && data.customerType ? data.customerType+" Customer" : "Visted "+(data.customerOrders ? data.customerOrders.count : 0)+" time(s) in last 30 days."
                            }
                        </TextView>
                    </View>
                    <View style = {styles.iconColumn}>
                        <TouchableOpacity
                            onPress={()=>{Linking.openURL(`tel:${data.phone}`)}}
                        >
                            <Ionicons name="md-call" size={30} color={"#2eb352"} /> 
                        </TouchableOpacity>
                    </View>
                    <View style = {styles.iconColumn}>
                        <Image
                            style = {{ width: 30, height: 30}}
                            source = {data.gender === "FEMALE" ? femaleIcon : maleIcon  }/>
                    </View>
                </View>
                {
                    data.address ? (
                        <View style = {styles.customerAddressRow}>
                            <TextView  style = {styles.addressText}>
                                {data.address}
                            </TextView>
                        </View>
                    ): null
                }
            </View>
        )
    }
}