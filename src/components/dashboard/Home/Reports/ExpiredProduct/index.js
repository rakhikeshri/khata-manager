import React from "react";
import {
    View,
    SafeAreaView,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    Linking,
    StatusBar
} from "react-native";
import TextView from "core/TextView";
import { connect } from "react-redux";
import {  getExpiredProduct, downloadOutOfStockProduct, saveFile } from '../../../../../actions/reportActions';
import { getConfig } from "./../../../../../common/AppConfig";
import moment from 'moment'
@connect((store) => {
    return {
        user: store.auth.user,
        expiredProduct: store.report.expiredProduct
    }
})
export default class ExpiredProduct extends React.Component {
    state = {
        isWaiting:true,
        expiredProduct:[]
    }

    componentDidMount(){
        const { user } = this.props;
        this.setState({
            isWaiting: true
        })
        this.props.dispatch(getExpiredProduct(user.accessToken)).then(()=> this.setState({isWaiting:false, expiredProduct: this.props.expiredProduct}));
    }

    onRefresh = ()=>{
        this.setState({
            isWaiting: true
        })

        this.props.dispatch(getExpiredProduct(user.accessToken)).then(()=> this.setState({isWaiting:false, expiredProduct: this.props.expiredProduct}));
    }

    downloadFile = async () => {
        const { user } = this.props;

        const url = getConfig("api").host+getConfig("api").root+'/reports/public/expiring/export/?t='+user.accessToken;
        Linking.openURL(url);
    }

    calculateWeek = (firstDate, seconDate) => {
        var difference =(seconDate.getTime() - firstDate.getTime()) / 1000;
        difference /= (60 * 60 * 24 * 7);
        return Math.abs(Math.round(difference));
    }

    calculateDays = (firstDate, seconDate) => {
        var oneDay = 24 * 60 * 60 * 1000; 
        var diffDays = Math.round(Math.abs((firstDate - seconDate) / oneDay));
        return diffDays
    }

    calculateDateColor = (week) => {
        let color = "";
        if(week < 2){
            color = "#e34343"
        } else if(week > 2 && week < 3){
            color = "#e67f22"
        } else if(week > 3 ){
            color = '#1dbd9c'
        }
        return color
    }

    render() {
        const { isWaiting, expiredProduct } = this.state;

        return (
            <SafeAreaView style = {{flex:1}}>
                <StatusBar barStyle="dark-content" backgroundColor="#1CBD9C" translucent = {false } />
                <FlatList 
                    refreshControl={
                        <RefreshControl
                            refreshing={isWaiting}
                            onRefresh={() => this.onRefresh()}
                            tintColor={'grey'}
                        />
                    }
                    data = {expiredProduct}
                    keyExtractor={(item, index) => index + item.name}
                    renderItem = {({item}) => {
                        
                        var firstDate = new Date(item.expiry);
                        var secondDate = new Date();

                        var days = this.calculateDays(firstDate, secondDate)
                        var week = this.calculateWeek(firstDate, secondDate)
                        var color = this.calculateDateColor(week)
                        return (
                            <View style={{flex:1, marginLeft:10, marginRight:10, marginTop:10, marginBottom:10, borderRadius:7, backgroundColor:'#f0f2f4', paddingHorizontal:20, paddingVertical:10, flexDirection:'row'}}>
                                <View style={{flex:4, alignItems:'flex-start', justifyContent:'center'}}>
                                    <View style={{flex:1, padding:2}}>
                                        <TextView style={{fontWeight:'bold', color:'#242424', fontSize:15}}>{item.name}</TextView>
                                    </View>
                                    <View style={{flex:1, alignItems:'center', justifyContent:'center', flexDirection:'row', padding:2}}>
                                        <TextView style={{color:'#242424', fontSize:15, width:80}}>{'Expiry Date'}</TextView>
                                        <TextView style={{ color:'#242424', fontSize:15, fontWeight:'bold'}}>{moment(item.expiry).format('DD/MM/YYYY')}</TextView>
                                    </View>
                                    <View style={{flex:1, flexDirection:'row', padding:2}}>
                                        <TextView style={{color:'#242424', fontSize:15,width:80}}>{'Available'}</TextView>
                                        <TextView style={{fontWeight:'bold', color:'#242424', fontSize:12, width:100, fontWeight:'bold'}}>{item.availableQuantity}</TextView>
                                    </View>
                                </View>
                                <View style={{flex:1}}>
                                    <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                                        <TextView style={{color:color, fontSize:15, fontWeight:'bold'}}>{days}</TextView>
                                        <TextView style={{ color:color, fontSize:15}}>{'Days Left'}</TextView>
                                    </View>
                                </View>
                            </View>
                        )
                    }}
                    keyExtractor = {item => item.pid}
                /> 
                <View style={{width:'100%', alignItems:'center', justifyContent:'center', paddingVertical:15}}>
                    <TouchableOpacity onPress={this.downloadFile} style={{backgroundColor:'#d33c6b', alignItems:'center', justifyContent:'center', borderRadius:24, paddingVertical:10, paddingHorizontal:80}}>
                        <TextView style={{color:'#fff', fontSize:16, fontWeight:'bold'}}>{'Export Report'}</TextView>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>    
        )
    }
}