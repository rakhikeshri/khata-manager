import React from "react";
import { connect } from "react-redux";
import {
    View,
    TouchableOpacity,
    Linking
} from "react-native";
import TextView from "core/TextView";
import { getConfig } from "./../../../common/AppConfig";

import styles from "./styles";

@connect((store) => {
    return {
        user: store.auth.user,
    }
})
export default class CoreReports extends React.Component {
    state = {
        asComponent: this.props.asComponent ? this.props.asComponent : false,
    }

    componentDidUpdate = (prevProps) => {
        if (this.props.asComponent !== prevProps.asComponent) {
            this.setState({
                asComponent: this.props.asComponent
            })
        }
    }

    dailyReport = () => {
        const { user } = this.props;

        const url = getConfig("api").host+getConfig("api").root+'/reports/public/dailyReport/export/?t='+user.accessToken;
        Linking.openURL(url);
    }

    navigate = (path) => {
        const { navigation } = this.props;
        console.log(path);
        switch(path) {
            case "Settlement": {
                navigation.navigate(path);
            }
        }
    }

    render(){
        const data = this.props.data;
        const { asComponent } = this.state;
        return (
            <View style={{flex:1}}>
                <TouchableOpacity onPress={this.props.openCalender} style={{flex:1, justifyContent:"center"}}>
                    <TextView style = {styles.calenderText}>
                        {this.props.maxStr}
                    </TextView>     
                </TouchableOpacity>
                <View style={{flex:2, justifyContent:"center"}}>
                    <TextView style = {styles.price}>
                        {
                            data.saleTotal && data.saleTotal.toString().indexOf(".") !== -1 ?
                                data.saleTotal.toFixed(2) 
                            : data.saleTotal ?
                                data.saleTotal
                            : 0
                        }
                    </TextView>
                    <TextView style = {styles.lowerText}>
                        {"Total Sales "}
                    </TextView>
                    <TextView style = {styles.lowerText}>
                        {"This Month (in ₹)"}
                    </TextView>
                </View>
                <View style={{ flex: 5 }}>
                    <View style={{flex:2, flexDirection:"row", justifyContent:"center"}}>
                        <View style={{flex:2, justifyContent:"center", marginTop: (asComponent ? -20 : 14), borderRight:"1px solid gray"}}>
                            <TextView style = {styles.price}>
                                {
                                    data.saleToday && data.saleToday.toString().indexOf(".") !== -1 ? 
                                        data.saleToday.toFixed(2)
                                    : data.saleToday ? 
                                        data.saleToday
                                    : 0
                                }
                            </TextView>
                            <TextView style = {styles.lowerText}>
                                {"Sales Today (in ₹)"}
                            </TextView>
                            {
                                asComponent ? null : (
                                    <View style={{ alignItems: 'center', marginTop: 8 }}>
                                        <TouchableOpacity onPress = {this.dailyReport} style={{ backgroundColor: '#34495e', borderRadius: 12, alignItems: 'center', justifyContent: 'center', paddingVertical: 6, paddingHorizontal: 15 }}>
                                            <TextView style={{ textAlign: 'center', color: '#fff', fontSize: 10 }}>Daily Report</TextView>
                                        </TouchableOpacity>
                                    </View>
                                )
                            }
                        </View>
                    </View>
                    <View style={{flex: 2, flexDirection:"row", justifyContent:"center"}}>
                        <TouchableOpacity
                            onPress={this.navigate.bind(this, "Settlement")}
                            style={{flex:2, justifyContent:"center", borderRight:"1px solid gray"}}>
                            <TextView style = {[styles.price, {color: "#D43D69"}]}>
                                {data.unsettledAmount || 0}
                            </TextView>
                            <TextView style = {styles.lowerText}>
                                {"Total Unsettled "}
                            </TextView>
                            <TextView style = {styles.lowerText}>
                                {"Amount (in ₹)"}
                            </TextView>
                        </TouchableOpacity>
                        <View style={{flex:2, justifyContent:"center"}}>
                            <TextView style = {styles.price}>
                                {data.noOfInvoices || 0}
                            </TextView>
                            <TextView style = {styles.lowerText}>
                                {"Invoice Generated "}
                            </TextView>
                            <TextView style = {styles.lowerText}>
                                {"This Month "}
                            </TextView>
                        </View>
                        <View style={{flex:2, justifyContent:"center", justifyContent:"center"}}>
                            <TextView style = {styles.price}>
                                {data.numberOfProducts || 0}
                            </TextView>
                            <TextView style = {styles.lowerText}>
                                {"Product Sold "}
                            </TextView>
                            <TextView style = {styles.lowerText}>
                                {"This Month "}
                            </TextView>
                        </View>
                    </View>
                </View>
                {
                    this.props.showSeeMore 
                        ?
                    <TouchableOpacity onPress={this.props.onPress} style={{flex:1, justifyContent:"center"}}>
                        <TextView style = {styles.footerText}>
                            {"See More "}
                        </TextView>
                    </TouchableOpacity>
                        :
                    null    
                }
            </View>
        )
    }
}