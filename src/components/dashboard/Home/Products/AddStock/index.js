import React from "react";
import { connect } from "react-redux";
import {
    View,
    TextInput,
    TouchableOpacity,
    Image,
    SafeAreaView,
    FlatList,
    KeyboardAvoidingView,
    RefreshControl,
    Dimensions,
    StatusBar
} from "react-native";
import CheckBox from "expo-checkbox";
import TextView from "core/TextView";
import Spinner from '../../../../core/Spinner'
import { Header } from 'react-navigation-stack';
import { getStockList, updateStock } from "./../../../../../actions/productActions";
import { updateLocalProductList, updateLocalStockList } from "./../../../../../common/productUtils";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";

const searchIcon = require('./../../../../../../assets/images/search.png');

@connect((store) => {
    return {
        user: store.auth.user,
        stockList: store.products.stockList,
        updateStock: store.products.updateStock,
        customeProduct: store.products.customeProduct
    }
})
export default class AddStock extends React.Component {
    state = {
        isWaiting: true,
        checked: {},
        stockList: [],
        q: ""
    }

    componentDidMount = () => {
        const { user, route } = this.props;
        const navigationParams = route?.params?.q;
        
        // if not coming from manual billing flow
        if (navigationParams) {
            this.handleSearchInput(navigationParams);
        } else {
            // get stock list
            this.props.dispatch(getStockList(user.accessToken)).then(() => this.setState({ isWaiting: false, stockList: this.props.stockList }));
        }

    }

    componentDidUpdate = (prevProps) => {
        if (this.props.updateStock !== prevProps.updateStock) {
            
        }

        if (this.props.stockList !== prevProps.stockList) {
            this.setState({
                stockList: this.props.stockList
            })
        }
    }

    handleSearchInput = (q) => {
        const { user } = this.props;

        this.setState({
            isWaiting: true,
            q,
        }, () => {
            this.props.dispatch(getStockList(user.accessToken, q)).then(() => this.setState({ isWaiting: false, stockList: this.props.stockList }));
        })
    }

    handleStockInput = (value, productId) => {
        if (isNaN(value)) {
            return;
        }

        const { checked } = this.state;

        checked[productId] = value;

        this.setState({ checked })
    }

    handleCheck = (item) => {
        const { checked } = this.state;

        if (!checked.hasOwnProperty(item.pid)) {
            checked[item.pid] = item.availableQuantity.toString();
        } else {
            delete checked[item.pid];
        }

        this.setState({
            checked
        })
    }

    onRefresh = () => {
        const { user } = this.props;
        this.props.dispatch(getStockList(user.accessToken)).then(() => this.setState({ isWaiting: false, stockList: this.props.stockList }));
    }

    submit = () => {
        const { checked } = this.state;
        const { dispatch, user, navigation } = this.props;

        dispatch(updateStock(user.accessToken, checked)).then(() => {
            alert("Stocks successfully updated!");
            // update local stock
            Object.keys(checked).map((pid) => {
                const updatedData = {
                    availableQuantity: parseInt(checked[pid])
                }
                updateLocalProductList(pid, updatedData);
                updateLocalStockList(pid, updatedData);
            })
        });
    }

    render() {
        const { stockList, checked, isWaiting, q } = this.state;

        return (
            // <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={Header.HEIGHT - 20} style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar barStyle="dark-content" backgroundColor="#1CBD9C" translucent = {false } />
                <View style={{ flex: .5, zIndex: 9999 }}>
                    <View style={styles.searchInputContainer}>
                        <TextInput
                            style={styles.searchInput}
                            onChangeText={this.handleSearchInput}
                            value = {q}
                            //onSubmitEditing = {this.search}
                            returnKeyType={"search"}
                            placeholder="Search order" />
                        <TouchableOpacity
                            onPress={this.search}
                            style={styles.searchButton}>
                            <Image source={searchIcon} style={{ width: 34, resizeMode: 'contain' }} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{
                    flex: 5,
                    // height: Dimensions.get("window").height - 200
                }}>
                    <FlatList
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isWaiting}
                                onRefresh={() => this.onRefresh()}
                                tintColor={'grey'}
                            />
                        }
                        data={stockList}
                        renderItem={({ item }) => {
                            return (
                                <View style={{
                                    flex: 1,
                                    height: 60,
                                    backgroundColor: "#f0f2f4",
                                    alignItems: "center",
                                    marginLeft: 12,
                                    marginRight: 12,
                                    marginTop: 12,
                                    borderRadius: 8,
                                    flexDirection: "row"
                                }}>
                                    <TouchableOpacity
                                        style={{
                                            width: 50,
                                            height: 50,
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <CheckBox
                                            value={checked.hasOwnProperty(item.pid)}
                                            onValueChange={() => this.handleCheck(item)} />
                                    </TouchableOpacity>
                                    <View style={{ flex: 1 }}>
                                        <TextView>
                                            {item.name}
                                        </TextView>
                                        <View style={{ flexDirection: 'row' }}>
                                            <TextView>
                                                {"Quantity" + " - "}
                                            </TextView>
                                            <TextView>
                                                {item.availableQuantity < 0 ? <Ionicons name="md-infinite" size={23} color={"#000"} /> : item.availableQuantity}
                                            </TextView>
                                        </View>
                                    </View>
                                    {
                                        checked.hasOwnProperty(item.pid) ? (
                                            <View style = {{ flexDirection: "row" }}>
                                                <TextInput
                                                    onChangeText={(value) => this.handleStockInput(value, item.pid)}
                                                    editable = {(item.availableQuantity < 0 && checked[item.pid]) || checked[item.pid] === -1 ? false : true}
                                                    style={{
                                                        width: 80,
                                                        height: 40,
                                                        backgroundColor: (item.availableQuantity < 0 && checked[item.pid]) || checked[item.pid] === -1 ? "lightgrey" : "#fff",
                                                        borderRadius: 8,
                                                        marginRight: 10,
                                                        textAlign: "center",
                                                        borderColor: "gray",
                                                        borderWidth: 1
                                                    }}
                                                    value={checked[item.pid].toString()}
                                                />

                                                <TouchableOpacity
                                                    onPress={() => {
                                                        let value = item.availableQuantity;
                                                        if (checked[item.pid] !== -1) {
                                                            value = -1
                                                        }

                                                        if (item.availableQuantity === -1 && checked[item.pid]) {
                                                            value = 0;
                                                        }
    

                                                        this.handleStockInput(value, item.pid)
                                                    }}
                                                    style = {{ 
                                                        width: 40,
                                                        height: 40,
                                                        backgroundColor: item.availableQuantity < 0 || checked[item.pid] === -1 ? "#db5185" : "lightgrey",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        borderRadius: 8,
                                                        marginRight: 18,
                                                    }}>
                                                    <Ionicons name="md-infinite" size={26} color={"#fff"} />
                                                </TouchableOpacity>
                                            </View>
                                        ) : null
                                    }
                                </View>
                            )
                        }}
                        keyExtractor={item => item.pid}
                    />
                </View>
                <View style={{ flex: 1 }}>
                    {
                        !isWaiting ? (
                            <View style={{
                                height: 60,
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#fff",
                                padding: 10,
                                marginTop: 20
                            }}>
                                <TouchableOpacity
                                    disabled={Object.keys(checked).length === 0 ? true : false}
                                    onPress={this.submit}
                                    style={{
                                        backgroundColor: Object.keys(checked).length === 0 ? "#d6dade" : "#d33c6b",
                                        width: 300,
                                        height: 50,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderRadius: 100
                                    }}
                                >
                                    <TextView style={{
                                        fontSize: 18,
                                        fontWeight: "bold",
                                        width: 70,
                                        color: "#fff"
                                    }}>
                                        Submit
                                    </TextView>
                                </TouchableOpacity>
                            </View>
                        ) : null
                    }
                </View>
            {/* </KeyboardAvoidingView> */}
            </SafeAreaView>
        )
    }
}