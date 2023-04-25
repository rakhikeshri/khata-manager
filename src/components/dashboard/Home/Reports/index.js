import React from "react";
import { connect } from "react-redux";
import {
    View,
    TouchableOpacity,
    Modal,
    StatusBar
} from "react-native";
import TextView from "../../../core/TextView";
import styles from "./style";
import MonthPicker from 'react-native-month-picker';
//component
import CoreReports from '../../../core/corereports/index';
import Spinner from '../../../core/Spinner/index'
import { getDashboardReport, getDashboardInitiallyReport } from '../../../../actions/reportActions';
import moment from 'moment'
@connect((store) => {
    return {
        user: store.auth.user,
        reports: store.report.reports
    }
})
export default class Reports extends React.Component {
    state = {
        isWaiting: false,
        reports: {},
        isOpen: false,
        dateValue: new Date(),
        mm : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        minDate: '',
        minStr: '',
        maxDate: '',
        maxStr: '',
        range:false,
        selectedDate: ""
    }
    componentDidMount() {
        this.setState({isWaiting:true})
        const { user } = this.props;
        let date = new Date(); 
        let maxDate = moment(date).format('YYYY/MM/DD');
        const maxStr = this.state.mm[date.getMonth()] + ', ' + date.getFullYear();
        this.setState({
            maxStr : maxStr,
            selectedDate: maxStr
        })
        let min = moment(new Date(date.getFullYear(), date.getMonth(), 1)).format('YYYY/MM/DD');
        this.props.dispatch(getDashboardInitiallyReport(user.accessToken, min)).then(() => this.setState({ isWaiting: false, reports: this.props.reports }));
    }
    navigateTo = (path) => {
        const { navigation } = this.props;
        navigation.navigate(path);
    }
    openAndroidDatePicker = () => {
        this.setState({
            isOpen: true
        })
    }

    toggleOpen = (val) => {
        this.setState({
            isOpen: false,

        })
    }
    setDateRange = () => {
        const { user } = this.props;
        this.setState({
            isOpen: false,
            selectedDate: this.state.maxStr
        }, () => {
            this.props.dispatch(getDashboardReport(user.accessToken, this.state.minDate, this.state.maxDate)).then(() => this.setState({ isWaiting: false, reports: this.props.reports }));
        })
    }
    onChange = (val) => {
        let {mm} = this.state;
        let min = new Date(val);
        const minDate = this.getDate(min);
        const minStr = mm[min.getMonth()] + ' ' + min.getDate() + ', ' + min.getFullYear();

        let date = new Date(val)
        // FIX ME - not returning correct range
        let max = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        const maxStr = mm[max.getMonth()] + ', ' + max.getFullYear();
        const maxDate = this.getDate(max);

        this.setState({
            minDate: minDate,
            minStr: minStr,
            maxDate: maxDate,
            maxStr: maxStr,
            range: true
        })
    }

    getDate(dateString) {
        const year = dateString.getFullYear();
        let month = dateString.getMonth() + 1;
        month = month.toString().length === 1 ? "0"+month : month.toString(); 
        let day = dateString.getDate();
        day = day.toString().length === 1 ? "0"+day : day.toString();

        return year+"/"+month+"/"+day;
    }

    render() {
        const { reports, range, minStr, maxStr, isWaiting, selectedDate } = this.state;
        const { navigation } = this.props;
        return (
            <View style={{ flex: 1 }}>
                <StatusBar barStyle="dark-content" backgroundColor="#1CBD9C" translucent = {false } />
                {
                    isWaiting ? <Spinner/> : null
                }
                <View style={{ flex: 1 }}>
                    <CoreReports
                        onPress={() => { console.log("pressed") }}
                        showSeeMore={false}
                        data={reports} 
                        maxStr= {selectedDate}
                        openCalender={this.openAndroidDatePicker}
                        navigation = { navigation }
                    />
                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <View>
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <TextView style={{ textAlign: 'center', color: '#242424', fontSize: 27, fontWeight: '700' }}>{reports.outOfStock}</TextView>
                            </View>
                            <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                                <TextView style={{ textAlign: 'center', color: '#242424', fontSize: 14 }}>Product running</TextView>
                                <TextView style={{ textAlign: 'center', color: '#242424', fontSize: 14 }}>out of stock.</TextView>
                            </View>
                        </View>
                        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 40 }}>
                            <TouchableOpacity onPress={this.navigateTo.bind(this, "OutOfStock")} style={{ backgroundColor: '#d33c6b', borderRadius: 11, alignItems: 'center', justifyContent: 'center', paddingVertical: 6, paddingHorizontal: 15 }}>
                                <TextView style={{ textAlign: 'center', color: '#fff' }}>See List</TextView>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ height: '50%', width: 2, backgroundColor: '#E7E9EB' }} />
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <View>
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <TextView style={{ textAlign: 'center', color: '#242424', fontSize: 27, fontWeight: '700' }}>{reports.expiring}</TextView>
                            </View>
                            <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                                <TextView style={{ textAlign: 'center', color: '#242424', fontSize: 14 }}>Product getting</TextView>
                                <TextView style={{ textAlign: 'center', color: '#242424', fontSize: 14 }}>expired this month.</TextView>
                            </View>
                        </View>
                        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 40 }}>
                            <TouchableOpacity onPress={this.navigateTo.bind(this, "ExpiredProduct")} style={{ backgroundColor: '#34495e', borderRadius: 11, alignItems: 'center', justifyContent: 'center', paddingVertical: 6, paddingHorizontal: 15 }}>
                                <TextView style={{ textAlign: 'center', color: '#fff' }}>See List</TextView>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={{ flex: .4 }} />
                <Modal
                    transparent
                    animationType="fade"
                    visible={this.state.isOpen}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                    }}>
                    <View style={styles.contentContainer}>
                        <View style={styles.content}>
                            <MonthPicker
                                selectedDate={this.state.minDate}
                                onMonthChange={this.onChange}
                            />
                            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                                <TouchableOpacity
                                    style={styles.confirmButton}
                                    onPress={this.setDateRange}>
                                    <TextView>Confirm</TextView>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.confirmButton}
                                    onPress={this.toggleOpen}>
                                    <TextView>Cancel</TextView>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }
}