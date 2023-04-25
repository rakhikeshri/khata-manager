import React from "react";
import {
    View,
    SafeAreaView,
    FlatList,
    TextInput,
    Image,
    Modal,
    TouchableOpacity,
    RefreshControl,
    StatusBar
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import CheckBox from "expo-checkbox";
import TextView from "core/TextView";
import { connect } from "react-redux";
import CustomModal, { ModalFooter, ModalButton, ModalContent } from 'react-native-modals';
import {
    wToDP
} from "common/ResponsiveDimension";

import QantitySelector from "./../../../../core/QuantitySelector/index"

import styles from "./styles";

const searchIcon = require('./../../../../../../assets/images/search.png');

import { saveToLocal, getFromLocal } from "./../../../../../common/utils";
import { getProductList } from "../../../../../actions/productActions";
import { appendScannedProducts, getSelectedUnit } from "./../../../../../common/orderUtils";
import { addProductToBill } from "./../../../../../actions/orderAction";
import { Ionicons } from "@expo/vector-icons";


@connect((store) => {
    return {
        user: store.auth.user,
        productList: store.products.productList,
    }
})
export default class ManualBilling extends React.Component {

    state = {
        rightNavMenuDisplay: false,
        searchKey: "",
        isWaiting: true,
        products: [],
        scannedProduct: {},
        checked: {},
        scanMoreModal: false,
        scannedQty: 1,
        selectedUnit: "",
        customDiscount: "",
        discountUnit: "₹",
        availableUnits: [],
        productList: []
    }

    componentDidMount = async () => {
        let discountUnit = "₹";
        const selectedDiscountUnit = await getFromLocal("selectedDiscountUnit");

        if (selectedDiscountUnit) {
            discountUnit = selectedDiscountUnit.discountUnit;
        }

        this.setState({
            discountUnit
        })

        const { user } = this.props;
        this.props.dispatch(getProductList(user.accessToken)).then(() => this.setState({ isWaiting: false, productList: this.props.productList }));

        this.props.navigation.setParams({
            openMenu: this.openMenu
        })
    }

    componentDidUpdate = (prevProps) => {
        if (this.props.productList !== prevProps.productList) {
            this.setState({
                productList: this.props.productList
            })
        }
    }

    handleSearchInput = (value) => {
        this.setState({
            searchKey: value,
            isWaiting: true
        }, () => {
            const { user } = this.props;
            this.props.dispatch(getProductList(user.accessToken, {}, "PUSH", {}, value)).then(() => this.setState({ isWaiting: false, productList: this.props.productList }));
        })
    }

    updateCount = (type = "inc", count) => {
        this.setState({
            scannedQty: count
        })
    }

    validateScannedQty = (type = "inc", maxAllowed = 1) => {
        if (type === "dec" && this.state.scannedQty === 0) {
            return false;
        }

        if (this.state.scannedQty + 1 > maxAllowed) {
            return false;
        }

        return true;
    }

    doneOneProduct = () => {
        const { 
            scannedProduct,
            selectedUnit,
            customDiscount,
            discountUnit,
            scannedQty,
            checked
        } = this.state;

        const product = checked[scannedProduct.pid];

        product.qty = scannedQty;
        product.selectedUnit = selectedUnit;
        product.customDiscount = customDiscount;

        if (discountUnit === "%") {
            const sUnit = getSelectedUnit(selectedUnit, product);
            const price = sUnit.rpu;
            product.customDiscount = (customDiscount * price * scannedQty) / 100;
            product.customDiscountPercent = customDiscount;
        }

        checked[scannedProduct.pid] = Object.assign({}, product);

        this.setState({
            scanMoreModal: false,
            checked,
            scannedQty: 1,
            selectedUnit: "",
            customDiscount: "",
            scannedProduct: {}
        })
    }

    cancelOneProduct = () => {
        const { scannedProduct, checked } = this.state;
        const pid = scannedProduct.pid;

        delete checked[pid];

        this.setState({
            scanMoreModal: false,
            checked,
            scannedQty: 1,
            selectedUnit: "",
            customDiscount: "",
            scannedProduct: {}
        })
    }

    done = () => {
        const { navigation } = this.props;

        const { checked } = this.state;

        Object.keys(checked).map((pid) => {
            const product = checked[pid];
            // if not undefined
            if (product) {
                const newBillPayload = appendScannedProducts(product);
                this.props.dispatch(addProductToBill(newBillPayload));
            }
        })

        navigation.navigate("SelectProduct")
    }

    handleCheck = (item) => {
        if (item.availableQuantity === 0) {
            alert("Product out of stock");
            return;
        }

        const { checked } = this.state;
        
        let selectedUnit = "";
        if (!checked.hasOwnProperty(item.pid)) {
            const newItem = Object.assign({}, item);
            if (item.hasOwnProperty("availableUnits") && item.availableUnits[0]) {
                selectedUnit = item.availableUnits[0].label;
            }

            newItem.qty = 1;
            newItem.selectedUnit = selectedUnit;
            newItem.customDiscount = 0;

            checked[item.pid] = newItem;

            this.setState({
                scanMoreModal: true,
                scannedProduct: newItem
            })
        } else {
            delete checked[item.pid];
        }

        this.setState({
            checked,
            selectedUnit
        })
    }

    onRefresh = () => {
        const { user } = this.props;
        this.props.dispatch(getProductList(user.accessToken)).then(() => this.setState({ isWaiting: false, productList: this.props.productList }));
    }

    addStock = (item) => {
        const { name } = item;
        const { navigation } = this.props;
        navigation.navigate("AddStock",{
            q: name
        });
    }

    render() {
        const { productList, checked } = this.state;

        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="#1CBD9C" translucent = {false } />
                <View style={styles.searchContainer}>
                    <View style={styles.searchInputContainer}>
                        <TextInput
                            style={styles.searchInput}
                            onChangeText={this.handleSearchInput}
                            returnKeyType={"search"}
                            placeholder="Search Product"
                            placeholderTextColor="#fff"  />
                        <TouchableOpacity
                            onPress={this.search}
                            style={styles.searchButton}>
                            <Image source={searchIcon} style={{ width: 34, resizeMode: 'contain' }} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.productFlatListContainer}>
                    <FlatList
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isWaiting}
                                onRefresh={() => this.onRefresh()}
                                tintColor={'grey'}
                            />
                        }
                        data={productList}
                        style={{ flex: 1 }}
                        renderItem={({ item, index }) => {
                            return (
                                <View style = {{ flexDirection: "row" }}>
                                    <TouchableOpacity
                                        onPress={() => this.handleCheck(item)}
                                        style={styles.product}
                                    >
                                        <View style={{
                                            flex: 1,
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}>
                                            <View
                                                style={{
                                                    width: 50,
                                                    height: 50,
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <CheckBox
                                                    disabled={item.availableQuantity === 0}
                                                    value={checked.hasOwnProperty(item.pid)}
                                                    onValueChange={() => this.handleCheck(item)} />
                                            </View>
                                        </View>
                                        <View style={{ flex: 4 }}>
                                            <View style={{ flex: 1, flexDirection: 'column' }}>
                                                <View style={{ flex: 1, flexDirection: 'column', padding: 4 }}>
                                                    <TextView style={{ fontSize: 18, color: '#282828', fontWeight: 'bold' }}>{item.name}</TextView>
                                                    <TextView style={{ fontSize: 12, color: '#282828' }}>{item.manufacturer}</TextView>
                                                </View>
                                                <View style={{ flex: 1, flexDirection: 'row', paddingTop: 2, paddingBottom: 2 }}>
                                                    <View style={{ flex: 1, flexDirection: 'column', }}>
                                                        <TextView style={{ fontSize: 16, color: '#9e9e9e', fontWeight: 'bold' }}>{item.weight?.value}{item.weight?.unit}</TextView>
                                                    </View>
                                                    <View style={{ flex: 1, flexDirection: 'row' }}>
                                                        <View style={{}}>
                                                            <TextView style={{ fontSize: 16, color: '#9e9e9e', fontWeight: 'bold' }}>{'Qty : '}</TextView>
                                                        </View>
                                                        <View style={{ flex: 1,}}>
                                                            <TextView style={{ fontSize: 16, color: '#000', fontWeight: 'bold', marginBottom: item.availableQuantity <0 ? 4 : 0 }}>{(item.availableQuantity < 0) ? <Ionicons name="md-infinite" size={25} color={"#000"} /> : item.availableQuantity}</TextView>
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={{ flexDirection: 'row', paddingTop: 2, paddingBottom: 2 }}>
                                                    <View style={{ flex: 1, flexDirection: 'column' }}>
                                                        <TextView style={{ fontSize: 16, color: '#242424', fontWeight: 'bold' }}>₹ {item.price}</TextView>
                                                    </View>
                                                    <View style={{ flex: 1, flexDirection: 'column' }}>
                                                        {(item.discount > 0) &&
                                                            <TextView style={{ fontSize: 16, color: '#1abc9c', fontWeight: 'bold' }}>{item.discount}% off</TextView>}
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        onPress = { this.addStock.bind(this, item) }
                                        style = {{ 
                                            flex: 1,
                                            backgroundColor: "#ecf0f1",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            borderTopRightRadius: 12,
                                            borderBottomRightRadius: 12,
                                            marginTop: 10,
                                            marginLeft: 2,
                                            marginRight: 4,
                                        }}>
                                        <TextView style = {{
                                            color: "#95a5a6",
                                            fontWeight: "bold"
                                        }}>
                                            Add
                                        </TextView>
                                        <TextView style = {{
                                            color: "#95a5a6",
                                            fontWeight: "bold"
                                        }}>
                                            Stock
                                        </TextView>
                                    </TouchableOpacity>
                                </View>
                            )
                        }}
                        keyExtractor={item => item._id}
                    />
                </View>
                <TouchableOpacity onPress={() => this.done()} style={{ width: '95%', borderRadius: 27, backgroundColor: '#20be9c', marginBottom: 15, marginTop: 10, marginLeft: 10, padding: 10, flexDirection: 'column', alignItems: 'center', justifyContents: 'center' }}>
                    <TextView style={{ fontSize: 16, fontWeight: 'bold', color: '#fff', width: 60, textAlign: "center" }}>{'Done'}</TextView>
                    <TextView style={{ fontSize: 16, color: '#fff' }}>{'( ' + Object.keys(checked).length + ' Product' + ' )'}</TextView>
                </TouchableOpacity>

                {/* Modal popup */}
                <CustomModal
                    visible={this.state.scanMoreModal}
                    footer={
                        <ModalFooter>
                            <ModalButton
                                text="Cancel"
                                onPress={this.cancelOneProduct}
                                textStyle={{ color: '#fff' }}
                                style={{ backgroundColor: '#317db9', marginTop: 2 }}
                            />
                            <ModalButton
                                text="Done"
                                onPress={this.doneOneProduct}
                                textStyle={{ color: '#fff' }}
                                style={{ backgroundColor: '#22bf9c', marginTop: 2 }}
                            />
                        </ModalFooter>
                    }
                >
                    <ModalContent style={[styles.scanMoreModalContainer, { width: wToDP("90%") }]}>
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                            <View style={{ flex: 2, alignItems: 'flex-end', justifyContent: 'center' }}>
                                <TextView style={{ color: 'black', fontSize: 16, fontWeight: 'bold', width: 100, textAlign: 'center' }}>{'Unit'}</TextView>
                            </View>
                            <View style={{ flex: 3, flexDirection: 'row' }}>
                                <Picker
                                    selectedValue={this.state.selectedUnit}
                                    style={{
                                        height: 50,
                                        width: "100%",
                                        borderColor: '#dedede',
                                        borderWidth: 1
                                    }}
                                    onValueChange={(itemValue, itemIndex) =>
                                        this.setState({ selectedUnit: itemValue })
                                    }
                                >
                                    {
                                        this.state.scannedProduct.hasOwnProperty("availableUnits") &&
                                            this.state.scannedProduct.availableUnits.length !== 0 ? (
                                                this.state.scannedProduct.availableUnits.map((unit, k) => {
                                                    return (
                                                        <Picker.Item key={"unit_" + k} label={unit.label} value={unit.label} />
                                                    );
                                                })
                                            ) : <Picker.Item key={"unit_" + 0} label={"Pack"} value={"Pack"} />
                                    }
                                </Picker>
                            </View>
                        </View>

                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                            <View style={{ flex: 2, alignItems: 'flex-end', justifyContent: 'center' }}>
                                <TextView style={{ color: 'black', fontSize: 16, width: 100, fontWeight: 'bold' }}>{'Quantity'}</TextView>
                            </View>
                            <View style={{ flex: 3, flexDirection: 'row' }}>
                                <QantitySelector
                                    count={this.state.scannedQty}
                                    bounds={{
                                        min: 1,
                                        max: this.state.scannedProduct.availableQuantity
                                    }}
                                    onChange={this.updateCount.bind(this)}
                                    style={{
                                        width: 46,
                                        height: 40
                                    }}
                                />
                            </View>
                        </View>

                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                            <View style={{ flex: 2, alignItems: 'flex-end', justifyContent: 'center' }}>
                                <TextView style={{ color: 'black', fontSize: 16, width: 100, fontWeight: 'bold' }}>{'Discount'}</TextView>
                            </View>
                            <View style={{ 
                                flex: 3,
                            }}>
                                <View style = {{
                                    flexDirection: 'row',
                                    // borderColor: 'gray',
                                    // borderWidth: 1,
                                    // borderRadius: 5,
                                    width: "100%"
                                }}>
                                    <Picker
                                        mode="dropdown"
                                        selectedValue={this.state.discountUnit}
                                        style={{
                                            height: 40,
                                            width: 80,
                                            fontSize: 16,
                                            backgroundColor: "blue",
                                            justifyContent: "center",
                                            color: "gray"
                                        }}
                                        onValueChange={(value) => {
                                            this.setState({ 
                                                discountUnit: value
                                            }, () => {
                                                saveToLocal("selectedDiscountUnit", JSON.stringify({discountUnit: value}));
                                            })
                                        }}>
                                        <Picker.Item label="₹" value="₹" />
                                        <Picker.Item label="%" value="%" />
                                    </Picker>

                                    <TextInput
                                        style={{
                                            borderRadius: 5,
                                            borderColor: 'gray',
                                            borderWidth: 1,
                                            height: 40,
                                            width: "50%",
                                            paddingRight: 6,
                                            paddingLeft: 8
                                        }}
                                        placeholder="0"
                                        onChangeText={text => { this.setState({ customDiscount: text }) }}
                                        keyboardType="phone-pad"
                                        maxLength={5}
                                    />
                                </View>
                            </View>
                        </View>
                    </ModalContent>
                </CustomModal>
            </SafeAreaView>
        )
    }
}