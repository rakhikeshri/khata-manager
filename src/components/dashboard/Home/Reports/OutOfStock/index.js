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
import {  getOutOFStockProduct, downloadOutOfStockProduct, saveFile } from '../../../../../actions/reportActions';
import { getConfig } from "./../../../../../common/AppConfig";

@connect((store) => {
    return {
        user: store.auth.user,
        outOfStockList: store.report.outOfStockList
    }
})
export default class OutOfStock extends React.Component {
    state = {
        isWaiting:true,
        outOfStockList:[]
    }

    componentDidMount(){
        const { user } = this.props;
        this.setState({
            isWaiting: true
        })

        this.props.dispatch(getOutOFStockProduct(user.accessToken)).then(()=> this.setState({isWaiting:false, outOfStockList: this.props.outOfStockList}));
    }

    onRefresh = ()=>{
        this.setState({
            isWaiting: true
        })

        this.props.dispatch(getOutOFStockProduct(user.accessToken)).then(()=> this.setState({isWaiting:false, outOfStockList: this.props.outOfStockList}));
    }

    downloadFile = async () => {
        const { user } = this.props;

        const url = getConfig("api").host+getConfig("api").root+'/reports/public/outofstock/export/?t='+user.accessToken;
        Linking.openURL(url);
    }

    calculateDateColor = (qty) => {
        let color = "";
        if(qty < 5){
            color = "#e34343"
        } else if(qty > 5 && qty < 10){
            color = "#e67f22"
        } else if(qty > 10 ){
            color = '#1dbd9c'
        }
        return color
    }

    render() {
        const { isWaiting, outOfStockList } = this.state;

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
                    data = {outOfStockList}
                    keyExtractor={(item, index) => index + item.name}
                    renderItem = {({item}) => {
                        var color = this.calculateDateColor(item.availableQuantity)
                        return (
                            <View style={{flex:1, marginLeft:10, marginRight:10, marginTop:10, marginBottom:10, borderRadius:7, backgroundColor:'#f0f2f4', paddingHorizontal:20, paddingVertical:13, flexDirection:'row'}}>
                                <View style={{flex:2, alignItems:'flex-start', justifyContent:'center'}}>
                                    <View style={{flex:1}}>
                                        <TextView style={{fontWeight:'bold', color:'#242424', fontSize:18}}>{item.name}</TextView>
                                    </View>
                                    <View style={{flex:1, flexDirection:'row', top:5}}>
                                        <TextView style={{color:'#242424', fontSize:14}}>{'Last Updated : '}</TextView>
                                        <TextView style={{color:'#242424', fontSize:14, left:5}}>{'20/01/2020'}</TextView>
                                    </View>
                                </View>
                                <View style={{flex:1}}>
                                    <View style={{flex:1, flexDirection:'row', alignItems:'flex-end', justifyContent:'flex-end'}}>
                                        <TextView style={{fontWeight:'bold', color:color, fontSize:18}}>{item.availableQuantity}</TextView>
                                        <TextView style={{color:color, fontSize:18, left:5}}>{'Left'}</TextView>
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