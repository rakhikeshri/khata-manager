import React from "react";
import { connect } from "react-redux";
import { 
  View,
  TouchableOpacity,
  StatusBar,
  Image,
  Linking
} from "react-native";
import CustomModal, { ModalFooter, ModalButton, ModalContent } from 'react-native-modals';
import TextView from "core/TextView";
import createOrder from "./../../../../assets/images/createOrder.png" ;
import ordersIcon from "./../../../../assets/images/orders.png" ;
import productsIcon from "./../../../../assets/images/products.png";
import customersIcon from "./../../../../assets/images/customers.png";
import helpIcon from "./../../../../assets/images/help.png";

import { 
  wToDP,
  hToDP
} from "common/ResponsiveDimension";

// style
import styles from "./styles";
import Spinner from '../../core/Spinner'

import { getDashboardReport, getDashboardInitiallyReport } from '../../../actions/reportActions';
import { showSubscriptionExpiredPopup, hideSubscriptionExpiredPopup } from '../../../actions/commonActions';
import moment from 'moment'
//report component
import CoreReports from '../../core/corereports/index'

@connect((store) => {
  return {
    user: store.auth.user,
    scanned: store.orders.scanned,
    reports: store.report.reports,
    subscriptionExpiredPopup: store.common.subscriptionExpiredPopup
  }
})
export default class Home extends React.Component {
  state={
    isWaiting:true,
    reports:{},
    range:false,
    mm : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    maxStr:"",
    minStr:"",
    maxDate:""
  }
  componentDidMount(){
    this.setState({isWaiting:true})
    const { user } = this.props;
    // let min = '2020/01/27';
    // let max = '2020/02/26'
    // this.props.dispatch(getDashboardReport(user.accessToken, min, max)).then(()=> this.setState({isWaiting:false, reports: this.props.reports}));
    let date = new Date();  
    let maxDate = moment(date).format('YYYY/MM/DD');
    const maxStr = this.state.mm[date.getMonth()] + ', ' + date.getFullYear();
    this.setState({
        maxStr : maxStr
    })
    let min = moment(new Date(date.getFullYear(), date.getMonth(), 1)).format('YYYY/MM/DD');
    this.props.dispatch(getDashboardInitiallyReport(user.accessToken, min)).then(() => this.setState({ isWaiting: false, reports: this.props.reports }));
  }
  
  navigateTo = (path) => {
    const { navigation } = this.props;
    navigation.navigate(path);
  }

  openSubscriptionUrl = () => {
    const url = "https://www.khatamanager.com";
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
  }

  render() {
    const { reports, maxStr, minStr, range, isWaiting } = this.state;
    const { navigation, dispatch } = this.props;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#1CBD9C" translucent = {false } />
        {
          isWaiting ? <Spinner/> : null
        }
        <View style={{flex:1}}>
          <CoreReports 
            data={reports} 
            onPress={this.navigateTo.bind(this, "Reports")} 
            maxStr= {maxStr}
            minStr={minStr}
            range={range}
            asComponent = {true}
            showSeeMore={true}
            navigation = { navigation }
          />
        </View>
        <View style={{flex:1, backgroundColor:'#f5f6fa'}}>
            <View style={{flex:1, flexDirection:'row', justifyContent:'space-evenly', alignItems:'center'}}>
                <TouchableOpacity 
                  onPress = {this.navigateTo.bind(this, "CreateBill")} 
                  style={{
                    borderRadius:12,
                    elevation: 5,
                    alignItems:'center',
                    justifyContent:'center',
                    backgroundColor:'#e67f22',
                    width: wToDP('20%'),
                    height: hToDP('10%')
                  }}
                >
                  <Image source={createOrder} style={{height:30, resizeMode:'contain'}}/>
                  <TextView style={{color:'#e4e4e4', fontSize:14, marginTop: 6, fontWeight:'bold'}}>{"Billing"}</TextView>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress = {this.navigateTo.bind(this, "Orders")}
                  style={{
                    borderRadius:12,
                    elevation: 5,
                    alignItems:'center',
                    justifyContent:'center',
                    backgroundColor:'#2c7fb9',
                    width: wToDP('20%'),
                    height: hToDP('10%')
                  }}>
                  <Image source={ordersIcon} style={{height:30, resizeMode:'contain'}}/>
                  <TextView style={{color:'#e4e4e4', fontSize:14, marginTop: 6, fontWeight:'bold'}}>{"Orders"}</TextView>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress = {this.navigateTo.bind(this, "Products")}
                  style={{
                    borderRadius:12,
                    elevation: 5,
                    alignItems:'center',
                    justifyContent:'center',
                    backgroundColor:'#d33c6b',
                    width: wToDP('20%'),
                    height: hToDP('10%')
                  }}>
                  <Image source={productsIcon} style={{height:30, resizeMode:'contain'}}/>
                  <TextView style={{color:'#e4e4e4', fontSize:14, marginTop: 6, fontWeight:'bold'}}>{"Products"}</TextView>
                </TouchableOpacity>
            </View>
            <View style={{flex:1, flexDirection:'row', justifyContent:'space-evenly', alignItems:'flex-start'}}>
                <TouchableOpacity 
                  onPress = {this.navigateTo.bind(this, "Customers")}
                  style={{
                    borderRadius:12,
                    elevation: 5,
                    alignItems:'center', 
                    justifyContent:'center', 
                    backgroundColor:'#76c762', 
                    width: wToDP('20%'),
                    height: hToDP('10%'),
                    marginLeft: 56
                  }}>
                  <Image source={customersIcon} style={{height:30, resizeMode:'contain'}}/>
                  <TextView style={{color:'#e4e4e4', fontSize:14, marginTop: 6, fontWeight:'bold'}}>{"Customers"}</TextView>
                </TouchableOpacity>
                {/* <TouchableOpacity 
                  onPress = {this.navigateTo.bind(this, "Customers")}
                  style={{
                    borderRadius:12,
                    elevation: 5,
                    alignItems:'center', 
                    justifyContent:'center', 
                    backgroundColor:'#d33c6b', 
                    width: wToDP('20%'),
                    height: hToDP('10%')
                  }}>
                  <Image source={customersIcon} style={{height:30, resizeMode:'contain'}}/>
                  <TextView style={{color:'#e4e4e4', fontSize:14, marginTop: 6, fontWeight:'bold'}}>{"Promote"}</TextView>
                </TouchableOpacity> */}
                <TouchableOpacity 
                  onPress = {this.navigateTo.bind(this, "Help")}
                  style={{
                    borderRadius:12,
                    elevation: 5,
                    alignItems:'center', 
                    justifyContent:'center', 
                    backgroundColor:'#34495e', 
                    width: wToDP('20%'),
                    height: hToDP('10%'),
                    marginRight: 56
                  }}>
                  <Image source={helpIcon} style={{height:30, resizeMode:'contain'}}/>
                  <TextView style={{color:'#e4e4e4', fontSize:14, marginTop: 6, fontWeight:'bold'}}>{"Help"}</TextView>
                </TouchableOpacity>
            </View>
        </View>

        {/* Subscribe Modal popup */}
        <CustomModal
          visible={this.props.subscriptionExpiredPopup}
          footer={
              <ModalFooter>
                  <ModalButton
                      text="Ok"
                      onPress={() => dispatch(hideSubscriptionExpiredPopup())}
                      textStyle={{ color: '#fff' }}
                      style={{ backgroundColor: '#317db9', marginTop: 2 }}
                  />
                  <ModalButton
                      text="Subscribe"
                      onPress={() => {
                        this.openSubscriptionUrl();
                        dispatch(hideSubscriptionExpiredPopup());
                      }}
                      textStyle={{ color: '#fff' }}
                      style={{ backgroundColor: '#22bf9c', marginTop: 2 }}
                  />
              </ModalFooter>
          }
      >
          <ModalContent style={[styles.scanMoreModalContainer, { width: wToDP("90%") }]}>
              <View>
                <TextView style = {{ fontSize: 18 }}>
                  You're not subscribed to any plan. Please subscribe to continue the service.
                </TextView>
              </View>
          </ModalContent>
      </CustomModal>
      </View>
    );
  }
}
