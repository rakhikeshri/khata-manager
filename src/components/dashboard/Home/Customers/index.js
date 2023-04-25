import React from "react";
import { connect } from "react-redux";
import {
    View,
    TextInput,
    TouchableOpacity,
    Image,
    FlatList,
    RefreshControl,
    StatusBar,
    Dimensions
} from "react-native";
import CustomerListItem from "./CustomerListItem/index";
import { Ionicons } from "@expo/vector-icons";

import { getCustomerList, searchCustomerList } from "./../../../../actions/customerAction";

import styles from "./styles";
import searchIcon from "./../../../../../assets/images/search.png";

@connect((store) => {
    return {
        user: store.auth.user,
        customerList: store.customers.customerList
    }
})

export default class Customers extends React.Component {
    state = {
        searchKey: "",
        isWaiting:true,
        customerList:[]
    }
    
    componentDidMount = () => {
        const { user, navigation } = this.props;

        this.props.navigation.setOptions({
            headerRight: () => (
                <View style = {{
                    width: Dimensions.get('window').width - 60,
                    height: "100%",
                }}>
                    <View style = {styles.searchInputContainer}>
                        <TextInput
                            style = {styles.searchInput}
                            onChangeText = {this.handleSearchInput}
                            onSubmitEditing = {this.search}
                            returnKeyType = {"search"}
                            placeholder = "Search customers"
                            placeholderTextColor = "#fff"/>
                        <TouchableOpacity
                            onPress = {this.search}
                            style = {styles.searchButton}>
                            <Image source={searchIcon} style={{width:30, marginTop: -8, resizeMode:'contain'}}/>
                        </TouchableOpacity>
                    </View>
                </View>
            ),
        });
        
        navigation.setParams({
            addCustomer: this.addCustomer
        })
        
        this.props.dispatch(getCustomerList(user.accessToken)).then(()=> this.setState({isWaiting:false, customerList:this.props.customerList}));
    }

    handleSearchInput = (value) => {
        this.setState({
            searchKey: value,
            isWaiting: true
        },()=>{
            const { user } = this.props;
            const {searchKey } = this.state;
            this.props.dispatch(searchCustomerList(searchKey, user.accessToken)).then(()=>this.setState({isWaiting:false,customerList:this.props.customerList}));
        })
   
    }

    search = () => {
        const { searchKey } = this.state;
        const { user } = this.props;
        this.setState({isWaiting:true})
        this.props.dispatch(searchCustomerList(searchKey, user.accessToken)).then(() => this.setState({isWaiting:false,customerList:this.props.customerList}));
    }

    onRefresh = () => {
        const { user } = this.props;
        this.props.dispatch(getCustomerList(user.accessToken)).then(()=> this.setState({isWaiting:false, customerList:this.props.customerList}));
    }

    addCustomer = () => {
        const { navigation } = this.props;
        navigation.navigate("AddCustomer");
    }

    render() {
        const { customerList } = this.state;

        return (
            <View style = {styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="#1CBD9C" translucent = {false } />
                <FlatList 
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isWaiting}
                            onRefresh={() => this.onRefresh()}
                            tintColor={'grey'}
                        />
                    }
                    data = {customerList}
                    renderItem = {({item}) => {
                        return <CustomerListItem data = {item} />
                    }}
                    keyExtractor = {item => item._id}
                />
            </View>
        )
    }
}