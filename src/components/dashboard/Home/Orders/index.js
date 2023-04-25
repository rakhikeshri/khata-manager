import React from "react";
import {
    View,
    SafeAreaView,
    FlatList,
    TextInput,
    Image,
    TouchableOpacity,
    RefreshControl,
    ActivityIndicator,
    StatusBar,
    Dimensions,
    ToastAndroid
} from "react-native";
import { connect } from "react-redux";

import OrderListItem from "./OrderListItem/index";
import Spinner from '../../../core/Spinner'

import styles from "./styles";

const searchIcon = require('./../../../../../assets/images/search.png');

import { getOrderList, searchOrderList, updateOrderList } from "./../../../../actions/orderAction";

@connect((store) => {
    return {
        user: store.auth.user,
        orderList: store.orders.orderList,
        moreOrder: store.orders.moreOrder,
        deleteOrder: store.orders.deleteOrder
    }
})
export default class Orders extends React.Component {
    state = {
        searchKey: "",
        isWaiting:true,
        orderList:[],
        pageLoading: false,
        pageInfo: {
            page: 1,
            limit: 10
        },
        deletedOrder: null,
        navigatedFromSettlement: false
    }

    componentDidMount = () => {
        this.props.navigation.setOptions({
            headerRight: this.getNavbarItems
        });

        const { pageInfo } = this.state;
        const navigationOrderList = this.props.navigation.route?.params.orders;
        if (navigationOrderList && navigationOrderList.length > 0) {
            this.setState({
                isWaiting: false,
                navigatedFromSettlement: true,
                orderList: navigationOrderList
            })
        } else {
            this.getOrderList(pageInfo, "REPLACE");
        }
    }

    getNavbarItems = () => {
        return (
            <View style = {{
                width: Dimensions.get('window').width - 60,
                height: "100%",
            }}>
                <View style = {styles.searchInputContainer}>
                    <TextInput
                        style = {styles.searchInput}
                        onChangeText = {this.handleSearchInput}
                        onSubmitEditing = {this.onSubmitEditing}
                        returnKeyType = {"search"}
                        placeholder = "Search orders"
                        placeholderTextColor = "#fff"/>
                    <TouchableOpacity
                        onPress = {this.search}
                        style = {styles.searchButton}>
                        <Image source={searchIcon} style={{width:30, resizeMode:'contain'}}/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    componentDidUpdate = (prevProps) => {
        if (this.props.orderList !== prevProps.orderList) {
            this.setState({
                orderList: this.props.orderList
            })
        }

        if (this.props.deleteOrder !== prevProps.deleteOrder) {
            const { orderList, dispatch } = this.props;
            const { deletedOrder } = this.state;

            ToastAndroid.showWithGravity(
                "Order deleted successfully.",
                ToastAndroid.SHORT,
                ToastAndroid.CENTER
            );

            setTimeout(() => {
                dispatch(
                    updateOrderList(
                        orderList.filter(order => order._id !== deletedOrder)
                    )
                );
            }, 500);
        }
    }

    handleSearchInput = (value) => {
        this.setState({
            searchKey: value,
            isWaiting:true
        }, () => {
            const { user } = this.props; 
            this.props.dispatch(searchOrderList(value, user.accessToken)).then(()=>this.setState({isWaiting:false, orderList:this.props.orderList}));
        })
    }

    search = () => {
        const { searchKey } = this.state;
        const { user } = this.props;
        this.setState({isWaiting:true})
        this.props.dispatch(searchOrderList(searchKey, user.accessToken)).then(()=>this.setState({isWaiting:false, orderList:this.props.orderList}));
    }

    onRefresh = () => {
        if ( !this.state.navigatedFromSettlement ) {
            const pageInfo = {
                page: 1,
                limit: 10
            };
    
            this.setState({
                pageInfo
            }, () => {
                this.getOrderList(pageInfo, "REPLACE");
            });
        }
    }

    getOrderList = (pageInfo = this.state.pageInfo, opt = "PUSH") => {
        const { user, moreOrder } = this.props;

        if (opt === "PUSH" && !moreOrder) {
            return;
        }

        this.props.dispatch(getOrderList(user.accessToken, pageInfo, opt))
            .then(() => this.setState({
                isWaiting:false,
                pageLoading: false,
                orderList:this.props.orderList
            }));
    }

    deletedOrder = (order) => {
        this.setState({
            deletedOrder: order
        })
    }

    render() {
        const { orderList, isWaiting } = this.state;
        return (
            <SafeAreaView style = {styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="#1CBD9C" translucent = {false } />
                {/* <View style = {styles.searchInputContainer}>
                    <TextInput
                        style = {styles.searchInput}
                        onChangeText = {this.handleSearchInput}
                        onSubmitEditing = {this.search}
                        returnKeyType = {"search"}
                        placeholder = "Search order"/>
                    <TouchableOpacity
                        onPress = {this.search}
                        style = {styles.searchButton}>
                        <Image source={searchIcon} style={{width:34, resizeMode:'contain'}}/>
                    </TouchableOpacity>
                </View> */}
                <FlatList 
                    refreshControl={
                        <RefreshControl
                            refreshing={isWaiting}
                            onRefresh={() => this.onRefresh()}
                            tintColor={'grey'}
                        />
                    }
                    data = {orderList}
                    renderItem = {({item}) => {
                        return <OrderListItem 
                            data = {item}
                            user = { this.props.user }
                            dispatch = { this.props.dispatch }
                            deletedOrder = { this.deletedOrder }
                            navigation = {this.props.navigation} 
                        />
                    }}
                    keyExtractor = {item => item._id}
                    onEndReachedThreshold = {0.5}
                    onEndReached = {() => {
                        const { pageInfo, pageLoading, navigatedFromSettlement } = this.state;
                        if (pageLoading || navigatedFromSettlement) {
                            return;
                        }

                        this.setState({
                            pageLoading: true,
                            pageInfo: {
                                ...pageInfo,
                                page: pageInfo.page + 1
                            }
                        }, () => {
                            this.getOrderList();
                        })
                    }}
                    scrollEventThrottle = {600}
                    ListFooterComponent = {() => {
                        const { moreOrder } = this.props;
                        const { pageLoading } = this.state;
                        if (!pageLoading || !moreOrder) return null;
                    
                        return <ActivityIndicator style={{ color: "#000" }} size = "large"/>;
                    }}
                />
            </SafeAreaView>
        )
    }
}