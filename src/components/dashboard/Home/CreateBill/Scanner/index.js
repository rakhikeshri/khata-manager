import React from "react";
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Image,
    TextInput,
    Dimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import TextView from "core/TextView";
import { connect } from "react-redux";
import * as Permissions from "expo-permissions";
import CustomModal, { ModalFooter, ModalButton, ModalContent } from 'react-native-modals';
import { BarCodeScanner } from "expo-barcode-scanner";
import QantitySelector from "./../../../../core/QuantitySelector/index";
import { saveToLocal, getFromLocal } from "./../../../../../common/utils";
import { appendScannedProducts } from "./../../../../../common/orderUtils";
import Spinner from '../../../../core/Spinner';
// actions
import { scanProduct, addProductToBill } from "./../../../../../actions/orderAction";

import styles from "./styles";
const { width } = Dimensions.get('window')
const Scanner_SIZE = width * 0.9
const Scanner_BORDER = 3
const theme = '#fff';

@connect((store) => {
    return {
        user: store.auth.user,
        scanned: store.orders.scanned
    }
})
export default class Scanner extends React.Component {
    state = {
        scanned: false,
        scannerOpen: false,
        scanMoreModal: false,
        scannedQty: 1,
        products: [],
        scannedProduct: {},
        isWaiting: false,
        selectedUnit: "",
        customDiscount: "",
        discountUnit: "₹",
        availableUnits: []
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

        this.setState({ isWaiting: false })
        const { status } = await Permissions.askAsync(
            Permissions.CAMERA
        );

        if (status === "granted") {
            this.setState({
                scannerOpen: true,
                scanned: false,
            })
        }
    }

    componentDidUpdate = (prevProps) => {
        if (this.props.scanned !== prevProps.scanned) {
            const { scanned } = this.props;
            if(scanned.hasOwnProperty("code") && scanned.code === "OUT_OF_STOCK") {
                this.setState({
                    scanned: false,
                    isWaiting: false,
                    scanMoreModal: false
                }, () => {
                    alert("This product is out of stock.");
                });
                return;
            }

            const product = scanned[0];
            
            let selectedUnit = "";
            if (product.hasOwnProperty("availableUnits") && product.availableUnits[0]) {
                selectedUnit = product.availableUnits[0].label;
            }

            this.setState({
                scanMoreModal: true,
                isWaiting: false,
                scannedProduct: product,
                selectedUnit
            })
        }
    }

    handleBarCodeScanned = ({ type, data }) => {
        this.setState({
            scanned: true,
            isWaiting: true
        }, () => {
            const { user } = this.props;
            const productId = data;
            // const productId = "5504759624";
    
            this.props.dispatch(scanProduct(productId, user.accessToken))
        })
    }

    done = () => {
        const { navigation } = this.props;

        this.setState({
            scanMoreModal: false,
            scanned: true
        }, () => {
            const { 
                products,
                customDiscount,
                discountUnit,
                selectedUnit,
                scannedQty
            } = this.state;
            const product = this.props.scanned[0];
            
            product.qty = scannedQty;
            product.selectedUnit = selectedUnit;
            product.customDiscount = customDiscount;

            if (discountUnit === "%") {
                product.customDiscount = (customDiscount * product.price) / 100;
            }

            products.push(product);

            this.setState({
                products,
                selectedUnit
            }, () => {
                products.map((product) => {
                    // if not undefined
                    if (product) {
                        const newBillPayload = appendScannedProducts(product);
                        this.props.dispatch(addProductToBill(newBillPayload));
                    }
                })
    
                navigation.navigate("CreateBill");
            })

        })
    }

    scanMore = () => {
        this.setState({
            scanMoreModal: false,
            scanned: false
        }, () => {
            const { 
                products,
                customDiscount,
                discountUnit,
                selectedUnit,
                scannedQty
            } = this.state;
            const product = this.props.scanned[0];
            
            product.qty = scannedQty;
            product.selectedUnit = selectedUnit;
            product.customDiscount = customDiscount;

            if (discountUnit === "%") {
                product.customDiscount = (customDiscount * product.price) / 100;
            }

            products.push(product);

            this.setState({
                products,
                selectedUnit
            })
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

    render() {
        const { scanned, isWaiting } = this.state;

        return (
            <View style={styles.container}>
                {
                    !isWaiting ? (
                        <BarCodeScanner
                            onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
                            style={[StyleSheet.absoluteFill, styles.scannerContainer]}
                        >
                            <TextView style={styles.description}>{'Move Your Camera Closer To Bar Code'}</TextView>
                            <View style={{ height: Scanner_SIZE, width: Scanner_SIZE, marginTop: '20%', marginBottom: '20%' }}>
                                <View style={{ position: 'absolute', left: -Scanner_BORDER, top: -Scanner_BORDER, height: 40, width: 40, borderTopColor: theme, borderTopWidth: Scanner_BORDER, borderLeftColor: theme, borderLeftWidth: Scanner_BORDER }} />
                                <View style={{ position: 'absolute', right: -Scanner_BORDER, bottom: -Scanner_BORDER, height: 40, width: 40, borderBottomColor: theme, borderBottomWidth: Scanner_BORDER, borderRightColor: theme, borderRightWidth: Scanner_BORDER }} />
                                <View style={{ position: 'absolute', right: -Scanner_BORDER, top: -Scanner_BORDER, height: 40, width: 40, borderTopColor: theme, borderTopWidth: Scanner_BORDER, borderRightColor: theme, borderRightWidth: Scanner_BORDER }} />
                                <View style={{ position: 'absolute', left: -Scanner_BORDER, bottom: -Scanner_BORDER, height: 40, width: 40, borderBottomColor: theme, borderBottomWidth: Scanner_BORDER, borderLeftColor: theme, borderLeftWidth: Scanner_BORDER }} />
                            </View>
                            <TextView onPress={() => this.props.navigation.goBack()} style={styles.cancel}>Cancel</TextView>
                        </BarCodeScanner>
                    ) : (
                        <View style={[StyleSheet.absoluteFill, styles.scannerContainer, { justifyContent: "center"}]}>
                            <View style={{ backgroundColor: "#d6dade", height: Scanner_SIZE, width: Scanner_SIZE, marginTop: '20%', marginBottom: '20%' }}>
                                <Spinner /> 
                            </View>
                        </View>
                    )
                }
                {/* Modal popup */}
                <CustomModal
                    visible={this.state.scanMoreModal}
                    footer={
                        <ModalFooter>
                            <ModalButton
                                text="Done"
                                onPress={this.done}
                                textStyle={{ color: '#fff' }}
                                style={{ backgroundColor: '#22bf9c' }}
                            />
                            <ModalButton
                                text="Scan More"
                                onPress={this.scanMore}
                                textStyle={{ color: '#fff' }}
                                style={{ backgroundColor: '#317db9' }}
                            />
                        </ModalFooter>
                    }
                >
                    <ModalContent style={styles.scanMoreModalContainer}>
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                            <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
                                <TextView style={{ color: 'black', fontSize: 16, fontWeight: 'bold' }}>{'Unit'}</TextView>
                            </View>
                            <View style={{ flex: 2, flexDirection: 'row' }}>
                                <Picker
                                    selectedValue = {this.state.selectedUnit}
                                    style = {{
                                        height: 50,
                                        width: 130,
                                        borderColor: 'gray',
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
                                                    <Picker.Item key = {"unit_"+k} label = {unit.label} value = {unit.label} />
                                                );
                                            })
                                        ) : <Picker.Item key = {"unit_"+0} label = {"Pack"} value = {"Pack"} />
                                    }
                                </Picker>
                            </View>
                        </View>

                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                            <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
                                <TextView style={{ color: 'black', fontSize: 16, fontWeight: 'bold' }}>{'Quantity'}</TextView>
                            </View>
                            <View style={{ flex: 2, flexDirection: 'row' }}>
                                <QantitySelector
                                    count={this.state.scannedQty}
                                    bounds = {{
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
                            <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
                                <TextView style={{ color: 'black', fontSize: 16, fontWeight: 'bold' }}>{'Add. Discount'}</TextView>
                            </View>
                            <View style={{ 
                                flex: 2,
                                flexDirection: 'row',
                                borderColor: 'gray',
                                borderWidth: 1,
                                borderRadius: 5,
                            }}>
                                <Picker
                                    selectedValue={this.state.discountUnit}
                                    style={{
                                        height: 40,
                                        width: 30,
                                        fontSize: 16,
                                        backgroundColor: "gray",
                                        justifyContent: "center",
                                        color: "#fff"
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
                                        height: 40,
                                        width: 80,
                                        paddingRight: 6,
                                        paddingLeft: 4
                                    }}
                                    onChangeText={text => { this.setState({ customDiscount: text }) }}
                                    keyboardType="phone-pad"
                                    maxLength={ 3 }
                                />
                            </View>
                        </View>
                    </ModalContent>
                </CustomModal>
            </View>
        )
    }
}