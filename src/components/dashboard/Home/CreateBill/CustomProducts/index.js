import React from "react";
import {
    View,
    Dimensions,
    TouchableOpacity,
    TextInput,
    FlatList,
    ActivityIndicator,
    Keyboard,
    ScrollView,
    StatusBar
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import CheckBox from "expo-checkbox";
import TextView from "core/TextView";
import { connect } from "react-redux";

import { Ionicons } from "@expo/vector-icons";

import styles from "./style";

import { saveToLocal, getFromLocal } from "./../../../../../common/utils";
import { appendScannedProducts } from "./../../../../../common/orderUtils";
import { addProductToBill } from "./../../../../../actions/orderAction";
import { fetchCustomProductSuggestion } from "./../../../../../actions/productActions";

@connect((store) => {
    return {
        user: store.auth.user,
        customProductsSuggestions: store.products.customProductsSuggestions
    }
})
export default class CustomProducts extends React.Component {
    state = {
        cProducts: [],
        suggestions: [],
        isWaiting: false,
        showSuggestion: false,
        selectedProduct: {
            name: "",
            price: 0,
            sgst: 0,
            cgst: 0,
            mrpIncludesTax: true,
            customDiscount: 0,
            discountUnit: "₹",
            quantity: 1
        }
    };

    componentDidMount = async () => {
        const { selectedProduct } = this.state;
        let discountUnit = "₹";
        const selectedDiscountUnit = await getFromLocal("selectedDiscountUnit");

        if (selectedDiscountUnit) {
            discountUnit = selectedDiscountUnit.discountUnit;
        }

        selectedProduct.discountUnit = discountUnit;

        this.setState({
            selectedProduct
        })
    }

    componentDidUpdate = (prevProps) => {
        if (this.props.customProductsSuggestions !== prevProps.customProductsSuggestions) {
            this.setState({
                isWaiting: false,
                showSuggestion: true,
                suggestions: this.props.customProductsSuggestions
            })
        }
    }

    getSuggestion = (value) => {
        const { user } = this.props;

        if (value && value.length === 0) {
            value = undefined;
        }
        
        this.setState({
            isWaiting: true,
        }, () => {
            this.props.dispatch(fetchCustomProductSuggestion(user.accessToken, value));
            this.handleInput("name", value);
        })
    }

    closeSuggestion = () => {
        this.setState({
            showSuggestion: false
        })
    }

    handleInput = (type, value) => {
        const { selectedProduct } = this.state;
        
        if (
            value.length !== 0 && 
            (
                type === "price" ||
                type === "cgst" ||
                type === "sgst" ||
                type === "customDiscount"||
                type === "quantity"
            )
        ) {
            if (value.indexOf(".") !== -1) {
                const arr = value.split(".");

                if (arr[1].length !== 0) {
                    value = parseFloat(value);
                }
            } else {
                value = parseFloat(value);
            }
        }

        if (type === "discountUnit") {
            saveToLocal("selectedDiscountUnit", JSON.stringify({discountUnit: value}));
        }

        selectedProduct[type] = value;

        const newSelectedProduct = Object.assign({}, selectedProduct);

        this.setState({
            selectedProduct: newSelectedProduct
        });
    }

    addMore = () => {
        const { selectedProduct, cProducts } = this.state;

        if (selectedProduct.name.length === 0) {
            alert("Please enter name of the product!");
            return;
        }

        cProducts.push(this.prepareCustomProduct(selectedProduct));
    
        const newCProducts = Object.assign([], cProducts);

        this.setState({
            cProducts: newCProducts,
            selectedProduct: {
                name: "",
                price: 0,
                sgst: 0,
                cgst: 0,
                mrpIncludesTax: true,
                customDiscount: 0,
                discountUnit: "₹",
                quantity: 1
            }
        })
    }

    prepareCustomProduct = (selectedProduct) => {
        let customDiscount = selectedProduct.customDiscount;

        if (selectedProduct.customDiscount !== 0 && selectedProduct.discountUnit === "%") {
            customDiscount = (selectedProduct.price * selectedProduct.customDiscount * selectedProduct.quantity) / 100
        }

        return {
            cgst: selectedProduct.cgst,
            type: selectedProduct.type,
            discount: 0,
            selectedUnit: selectedProduct.selectedUnit,
            availableUnits: selectedProduct.availableUnits,
            customDiscount,
            mrpIncludesTax: selectedProduct.mrpIncludesTax,
            name: selectedProduct.name,
            price: selectedProduct.price,
            qty: selectedProduct.quantity ? selectedProduct.quantity : 1,
            sgst: selectedProduct.sgst
        }
    }

    done = () => {
        const { cProducts, selectedProduct } = this.state;
        const { navigation } = this.props;

        let selectedProductIncluded = false;

        for (let i = 0; i < cProducts.length; i++ ) {
            const product = cProducts[i];
            if (product.name === selectedProduct.name) {
                selectedProductIncluded = true;
            }
            
            const obj = {
                name: product.name,
                quantity: product.qty,
                price: product.price,
                discountUnit: product.discountUnit,
                type: "Custom",
                discount: 0,
                selectedUnit: {
                    label: "Unit",
                    cfactor: 1,
                    rpu: product.price
                },
                availableUnits: [
                    {
                        label: "Unit",
                        cfactor: 1,
                        rpu: product.price
                    }
                ],
                smallestUnit: {
                    label: "Unit",
                    cfactor: 1,
                    rpu: product.price
                },
                sgst: product.sgst,
                cgst: product.cgst,
                gst: product.sgst + product.cgst,
                customDiscount: product.customDiscount,
                mrpIncludesTax: product.mrpIncludesTax
            }

            const preparedProduct = this.prepareCustomProduct(obj);

            const newBillPayload = appendScannedProducts(preparedProduct);
            this.props.dispatch(addProductToBill(newBillPayload));
        }

        // include selected product if not included
        if (!selectedProductIncluded && selectedProduct.name.length !== 0) {
            const product = selectedProduct;
            const obj = {
                name: product.name,
                quantity: product.quantity,
                price: product.price,
                discountUnit: product.discountUnit,
                mrp: product.price,
                type: "Custom",
                discount: 0,
                selectedUnit: {
                    label: "Unit",
                    cfactor: 1,
                    rpu: product.price
                },
                availableUnits: [
                    {
                        label: "Unit",
                        cfactor: 1,
                        rpu: product.price
                    }
                ],
                smallestUnit: {
                    label: "Unit",
                    cfactor: 1,
                    rpu: product.price
                },
                sgst: product.sgst,
                cgst: product.cgst,
                gst: product.sgst + product.cgst,
                customDiscount: product.customDiscount,
                mrpIncludesTax: product.mrpIncludesTax
            }

            const preparedProduct = this.prepareCustomProduct(obj);

            const newBillPayload = appendScannedProducts(preparedProduct);
            this.props.dispatch(addProductToBill(newBillPayload));
        }

        navigation.navigate("SelectProduct");
    }

    selectSuggestion = (item) => {
        const { selectedProduct } = this.state;
        this.setState({
            selectedProduct: {
                ...selectedProduct,
                ...item
            },
            showSuggestion: false
        }, () => {
            Keyboard.dismiss();
        })
    }

    render () {
        const { 
            cProducts,
            suggestions,
            isWaiting,
            showSuggestion,
            selectedProduct
        } = this.state;
        const windowWidth = Dimensions.get('window').width;
        const windowHeight = Dimensions.get('window').height;
        
        return (
            <View style = {styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="#1CBD9C" translucent = {false } />
                {/* Form */}
                <ScrollView style = {[styles.formWrapper, { width: windowWidth, flex: 1}]} keyboardShouldPersistTaps="always">
                    <View style = {styles.formRowWrapper}>
                        <TextView style = {styles.formText}>
                            Name
                        </TextView>
                        <View style = {[styles.formInputStyle, { flexDirection: "row", alignItems: "center"}]}>
                            <TextInput 
                                onChangeText = { this.getSuggestion }
                                onBlur = { this.closeSuggestion }
                                style = {{ flex: 1 }}
                                value = { selectedProduct.name }
                                placeholder = "Product Name"></TextInput>
                            <View style = {{ alignItems: "flex-end", justifyContent: "center", width: 50, height: 50}}>
                                <ActivityIndicator size='small' animating={isWaiting}/>
                            </View>
                        </View>
                        {
                            suggestions.length && showSuggestion ? (
                                <View style = {{
                                    position: "absolute",
                                    top: 100,
                                    zIndex: 999,
                                    alignSelf: "center",
                                    width: "100%",
                                    height: 100,
                                    backgroundColor: "#fff",
                                    elevation: 4,
                                    borderBottomLeftRadius: 8,
                                    borderBottomRightRadius: 8
                                }}>
                                    <FlatList
                                        data={suggestions}
                                        keyboardShouldPersistTaps='handled'
                                        style={{ flex: 1 }}
                                        keyExtractor = {item => item.pid}
                                        renderItem={({ item, index }) => {
                                            return (
                                                <TouchableOpacity 
                                                    onPress = { () => this.selectSuggestion(item) }
                                                    style = {{
                                                        height: 50,
                                                        paddingLeft: 12,
                                                        paddingRight: 12,
                                                        justifyContent: "center"
                                                    }}>
                                                    <TextView>{item.name}</TextView>
                                                </TouchableOpacity> 
                                            )
                                        } }></FlatList>
                                </View>
                            ): null
                        }
                    </View>
                    <View style = {styles.formRowWrapper}>
                        <TextView style = {styles.formText}>
                            MRP
                        </TextView>
                        <TextInput 
                            onChangeText = { (value) => this.handleInput("price", value) }
                            keyboardType = {"decimal-pad"}
                            style = {styles.formInputStyle}
                            value = { selectedProduct.price.toString() }
                            placeholder = "₹"></TextInput>
                    </View>
                    <View style = {{ flexDirection: "row" }}>
                        <View style = {styles.formWrapperColumn}>
                            <TextView style = {styles.formText}>
                                CGST
                            </TextView>
                            <TextInput 
                                onChangeText = { (value) => this.handleInput("cgst", value) }
                                keyboardType = {"decimal-pad"}
                                style = {styles.formInputStyle}
                                value = { selectedProduct.cgst.toString() }
                                placeholder = "%"></TextInput>
                        </View>
                        <View style = {styles.formWrapperColumn}>
                            <TextView style = {styles.formText}>
                                SGST
                            </TextView>
                            <TextInput 
                                onChangeText = { (value) => this.handleInput("sgst", value) }
                                keyboardType = {"decimal-pad"}
                                style = {styles.formInputStyle}
                                value = { selectedProduct.sgst.toString() }
                                placeholder = "%"></TextInput>
                        </View>
                    </View>
                    <View style = {styles.formRowWrapper}>
                        <TextView style = {styles.formText}>
                            Discount
                        </TextView>
                        <View style = {{flexDirection: "row"}}>
                            <Picker
                                selectedValue={this.state.selectedProduct.discountUnit}
                                style={{
                                    marginTop: 12,
                                    width: "20%",
                                    height : 50,
                                    borderWidth: 1,
                                    borderColor: "#dedede",
                                    borderRadius: 8,
                                    fontSize: 14
                                }}
                                onValueChange={(value) => this.handleInput("discountUnit", value)}>
                                <Picker.Item label="₹" value="₹" />
                                <Picker.Item label="%" value="%" />
                            </Picker>
                            <TextInput 
                                value = { selectedProduct.customDiscount.toString() }
                                keyboardType = {"decimal-pad"}
                                onChangeText = { (value) => this.handleInput("customDiscount", value) }
                                style = {[styles.formInputStyle, { width: "80%"}]}
                                placeholder = "₹"></TextInput>
                        </View>
                    </View>
                    <View style = {styles.formRowWrapper}>
                        <TextView style = {styles.formText}>
                            Quantity
                        </TextView>
                        <TextInput 
                            onChangeText = { (value) => this.handleInput("quantity", value) }
                            keyboardType = {"decimal-pad"}
                            style = {styles.formInputStyle}
                            value = { selectedProduct.quantity.toString()}
                            placeholder = "1"></TextInput>
                    </View>
                    <View style = {[styles.formRowWrapper, { flexDirection: "row", alignItems: "center" }]}>
                        <CheckBox value = {selectedProduct.mrpIncludesTax}></CheckBox>
                        <TextView>
                            Mrp Includes Tax
                        </TextView>
                    </View>
                </ScrollView>
                <View style = {styles.formFooter}>
                    <TouchableOpacity 
                        onPress = { this.done }
                        style = {styles.doneButton}>
                        <TextView style = {styles.buttonText}>
                            Done
                        </TextView>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress = { this.addMore }
                        style = {styles.addMoreButton}>
                        <View style = {{ flexDirection: "row" }}>
                            <Ionicons name="md-add" size={20} color={"#fff"} />
                            <TextView style = {styles.buttonText}>
                                Add More
                            </TextView>
                        </View>
                        {
                            cProducts.length !== 0 ? (
                                <TextView style = {styles.buttonHelperText}>
                                    {"("+cProducts.length+" Custom Items added)"}
                                </TextView>
                            ): null
                        }
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}