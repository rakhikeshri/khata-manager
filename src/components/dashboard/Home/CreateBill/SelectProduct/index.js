import React from "react";
import { connect } from "react-redux";
import { 
    View,
    Image,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    Modal,
    ScrollView,
    StatusBar
} from "react-native";
import TextView from "core/TextView";
import { Ionicons } from "@expo/vector-icons";
import QuantitySelector from "core/QuantitySelector/index";

// style
import styles from "./styles";

import { addProductToBill, resetCreateOrder } from "./../../../../../actions/orderAction";

import { getInitialOrderState, deleteProductsFromBill, calculateDiscount, getSelectedUnit } from "common/orderUtils";
import { saveToLocal, getFromLocal } from "common/utils";

//import QantitySelector from "./../../../core/QuantitySelector/index"

// Spinner
import Spinner from 'core/Spinner'

const rupee = require("./../../../../../../assets/images/rupee.png");

let totalItems = 0;
let price = 0;

const DEFAULT_SIZE_MULTIPLIER = 0.7
const DEFAULT_OUTER_BORDER_WIDTH_MULTIPLIER = 0.2

@connect((store) => {
    return {
      user: store.auth.user,
      scanned: store.orders.scanned,
      createBillPayload: store.orders.createBillPayload
    }
})
export default class CreateBill extends React.Component {
    static navigationOptions = ({ route }) => {
        const openMenu = route?.params.openMenu;
        return {
            // headerRight: () => (
            //     <TouchableOpacity 
            //         style = {{
            //             width: 60,
            //             height: 58,
            //             alignItems: "center",
            //             justifyContent: "center"
            //         }}
            //         onPress = {openMenu}
            //     >
            //         <Ionicons name="md-more" size={40} color={"#fff"} />
            //     </TouchableOpacity>
            // )
        };
    };
    state = {
        scanned : false,
        scannerOpen: false,
        scanMoreModal: false,
        isWaiting:true,
        rightNavMenuDisplay: false,
        size: 16,
        innerColor: '#20be9c',
        outerColor: '#20be9c',
        isSelectedScan: true,
        isSelectedManual: false,
    }

    componentDidMount = async () => {
        // const { dispatch } = this.props;
        // const createOrderInitialState = getInitialOrderState();

        // dispatch(addProductToBill(createOrderInitialState));

        // dispatch(resetCreateOrder());
        this.setState({isWaiting:false})

        this.props.navigation.setParams({
            openMenu: this.openMenu
        })

        // select bill mode
        const mode = await getFromLocal("billMode");

        if(mode && mode.billingMode === "scan") {
            this.radioPressedScan();
        } else {
            this.radioPressedManual();
        }
    }

    openMenu = () => {
        this.setState({
            rightNavMenuDisplay: !this.state.rightNavMenuDisplay
        })
    }
    
    openScanner = async () => {
        const { navigation } = this.props;
        navigation.navigate("Scanner");
    }

    proceed = () => {
        const { navigation, createBillPayload } = this.props;
        const { products } = createBillPayload;
        let totalDiscount = 0;
        let totalPrice = 0;
        
        products.map((item) => {
            const selectedUnit = getSelectedUnit(item.selectedUnit, item);
            const customDiscount = typeof item.customDiscount === "string" && item.customDiscount.length !== 0 ? 
                parseFloat(item.customDiscount) : typeof item.customDiscount === "string" && item.customDiscount.length === 0 ? 0 : item.customDiscount;
            totalDiscount += calculateDiscount(
                selectedUnit.rpu || item.price,
                item.qty,
                item.discount,
                customDiscount
            );
        })

        totalPrice = this.getTotalPrice(products);

        const totalItems = products.reduce((totalProductItems, product) => totalProductItems + product.qty, 0);
        navigation.navigate("PaymentMethod",{
            price: totalPrice,
            totalItems : totalItems,
            totalDiscount
        });
    }

    manualBilling = () => {
        this.setState({
            rightNavMenuDisplay: false
        }, () => {
            const { navigation } = this.props;
            navigation.navigate("ManualBilling");
        })
    }

    openManual = () => {
        if(this.state.isSelectedManual){
            this.props.navigation.navigate("ManualBilling");
        }
    }

    openCustom = () => {
        this.props.navigation.navigate("CustomProducts");
    }

    updateProductCount = (key, type, count) => {
        const { createBillPayload } = this.props;
        const { products } = createBillPayload;
        const product = products[key];

        // add count
        product.qty = count;

        // add discount
        if (product.customDiscountPercent) {
            const dis = parseFloat(product.customDiscountPercent);
            const selectedUnit = getSelectedUnit(product.selectedUnit, product);
            const price = selectedUnit.rpu || product.price;

            product.customDiscount = (dis * price * count) / 100;
        }

        products[key] = Object.assign({}, product);
        createBillPayload.products = Object.assign([], products);

        const newBillPayload = Object.assign({}, createBillPayload);

        this.props.dispatch(addProductToBill(newBillPayload));
    }

    removeItem = (index) => {
        const products = deleteProductsFromBill(index)
        this.props.dispatch(addProductToBill(products));
    }

    radioPressedScan = () => {
        this.setState({
            rightNavMenuDisplay: false,
            isSelectedScan : true,
            isSelectedManual : false
        }, () => {
            saveToLocal("billMode", JSON.stringify({billingMode: "scan"}));
        })
    }

    radioPressedManual = () => {
        this.setState({
            rightNavMenuDisplay: false,
            isSelectedManual : true,
            isSelectedScan : false
        }, () => {
            saveToLocal("billMode", JSON.stringify({billingMode: "manual"}));
        })
    }

    openMenu = () => {
        this.setState({
            rightNavMenuDisplay: !this.state.rightNavMenuDisplay
        })
    }

    getTotalPrice = (products) => {
        let totalDiscount = 0;
        const totalPrice = products.reduce((totalProduct, product) => {
            const selectedUnit = getSelectedUnit(product.selectedUnit, product);
            const customDiscount = typeof product.customDiscount === "string" && product.customDiscount.length !== 0 ? 
                parseFloat(product.customDiscount) : typeof product.customDiscount === "string" && product.customDiscount.length === 0 ? 0 : product.customDiscount;
            totalDiscount += calculateDiscount(
                selectedUnit.rpu || product.price,
                product.qty,
                product.discount,
                customDiscount
            );

            return totalProduct + (selectedUnit.rpu * product.qty)
        }, 0);

        return totalPrice - totalDiscount;
    }
      
    render() {
        const { createBillPayload } = this.props;
        const { products } = createBillPayload;
        const { 
            isWaiting,
            rightNavMenuDisplay,
            size,
            innerColor,
            outerColor,
            isSelectedScan,
            isSelectedManual,
        } = this.state;

        const outerStyle = {
            borderColor: outerColor,
            width: size + size * DEFAULT_SIZE_MULTIPLIER,
            height: size + size * DEFAULT_SIZE_MULTIPLIER,
            borderRadius: (size + size * DEFAULT_SIZE_MULTIPLIER) / 2,
            borderWidth: size * DEFAULT_OUTER_BORDER_WIDTH_MULTIPLIER
        }
    
        const innerStyle = {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: innerColor
        }

        const totalItems = products.reduce((totalProductItems, product) => totalProductItems + product.qty, 0);
        const price = this.getTotalPrice(products);
        
        return (
            <SafeAreaView style={{flex:1}}>
                <StatusBar barStyle="dark-content" backgroundColor="#1CBD9C" translucent = {false } />
                <View style = {styles.container}>
                    <FlatList
                        data={products}
                        style={{ flex: 1 }}
                        renderItem={({ item, index }) => {
                            const selectedUnit = getSelectedUnit(item.selectedUnit, item);
                            const price = selectedUnit.rpu || item.price;
                            let discount =
                                (price * item.discount * item.qty) / 100 +
                                (parseFloat(item.customDiscount) || 0);
                            
                            discount = discount.toString().indexOf(".") !== -1 ? discount.toFixed(2) : discount

                        return (
                            <View>
                                <TouchableOpacity
                                    style={styles.product}
                                >
                                    <View style={{ flex: 1, flexDirection:'row'}}>
                                        <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                                            <TouchableOpacity onPress={this.removeItem.bind(this, index)} style={{alignItems:'center', justifyContent:'center'}}>
                                                <Ionicons name="md-trash" size={28} color={"lightgrey"} />
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ flex: 4, flexDirection: 'column'}}>
                                            <View style={{ flex: 1, flexDirection: 'column'}}>
                                                <View style={{flex:1, flexDirection:'row'}}>
                                                    <TextView style={{ fontSize: 16, color: '#282828', fontWeight: 'bold' }}>{item.name}</TextView>
                                                    <TextView style={{ fontSize: 14, color: '#282828', fontWeight: 'bold' }}>{' x ' + item.qty}</TextView>
                                                </View>
                                                <View style={{flex:1}}>
                                                    <TextView style={{ fontSize: 12, color: '#282828' }}>{item.manufacturer}</TextView>
                                                </View>
                                            </View>
                                            <View style={{ flex: 1, flexDirection: 'row', paddingTop: 7, paddingBottom: 2 }}>
                                                <View style={{ flex: 3, flexDirection: 'column', }}>
                                                    <TextView style={{ fontSize: 16, color: '#9e9e9e', fontWeight: 'bold' }}>{item.weight?.value}{item.weight?.unit}</TextView>
                                                </View>
                                                <View style={{ flex: 5, flexDirection: 'row' }}>
                                                    <View style={{}}>
                                                        <TextView style={{ fontSize: 16, color: '#9e9e9e', fontWeight: 'bold' }}>{'Stock : '}</TextView>
                                                    </View>
                                                    <View style={{ flex: 1 }}>
                                                        <TextView style={{ fontSize: 14, color: '#000', fontWeight: 'bold' }}>{(item.availableQuantity < 0) ? <Ionicons name="md-infinite" size={33} color={"#000"} /> : item.availableQuantity}</TextView>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row', paddingTop: 2, paddingBottom: 2 }}>
                                                <View style={{ flex: 3, flexDirection: 'column' }}>
                                                    <TextView style={{ fontSize: 16, color: '#242424', fontWeight: 'bold' }}>₹ {price * item.qty}</TextView>
                                                </View>
                                                <View style={{ flex: 5, flexDirection: 'column' }}>
                                                    <TextView style={{ fontSize: 14, color: '#1abc9c', fontWeight: 'bold' }}>Disc: ₹ {discount}{" "}</TextView>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{flex:1, flexDirection:'column'}}>
                                            <View style={{flex:1, justifyContent:'center', alignItems:'flex-end'}}>
                                                <View style={{backgroundColor:'#E9E9E9', borderRadius:4, flexDirection:'row', paddingHorizontal:10, paddingVertical:5 }}>
                                                    <TextView style={{fontSize:12, color:'#9e9e9e', fontWeight:'bold'}}>{'Unit : '}</TextView>
                                                    <TextView style={{fontSize:12, color:'#000', fontWeight:'bold'}}>{selectedUnit?.label}</TextView>
                                                </View>
                                            </View> 
                                            <View style={{flex:1, alignItems:'flex-end', justifyContent:'flex-end'}}>
                                                <QuantitySelector
                                                    count={item.qty}
                                                    bounds={{
                                                        min: 1,
                                                        max: item.availableQuantity
                                                    }}
                                                    onChange={this.updateProductCount.bind(this, index)}
                                                    style={{
                                                        width: 30,
                                                        height: 30
                                                    }}
                                                />
                                            </View>    
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                {
                                    products && index === products.length - 1 ? (
                                        <View style = {{ height: 120 }}>

                                        </View>
                                    ) : null
                                }
                            </View>
                        )}}
                        keyExtractor={item => item._id}
                    />
                    <View style={{width:'100%', position:'absolute', justifyContent:'center',bottom:0}}>
                        <View style={{flex:1, alignItems:'flex-end', justifyContent:'center', padding:10}}>
                            <TouchableOpacity style={styles.scanContainer} onPress = {this.openCustom}>
                                <Ionicons name="md-add" size={40} color={"#fff"} />
                            </TouchableOpacity>
                        </View>
                        {
                            isSelectedScan ? (
                                <View style={{flex:1, alignItems:'flex-end', justifyContent:'center',padding:10}}>
                                    <TouchableOpacity style={styles.scanContainer} onPress = {this.openScanner}>
                                        <Ionicons name="md-qr-scanner" size={40} color={"#fff"} />
                                    </TouchableOpacity>
                                </View>
                            ): null
                        }

                        {
                            isSelectedManual ? (
                                <View style={{flex:1, alignItems:'flex-end', justifyContent:'center',padding:10}}>
                                    <TouchableOpacity style={styles.scanContainer} onPress = {this.openManual}>
                                        <Ionicons name="md-document" size={40} color={"#fff"} />
                                    </TouchableOpacity>
                                </View>
                            ) : null
                        }
                        <View style={{flex:1,flexDirection:'row'}}>
                            <TouchableOpacity style={{flex:1, flexDirection:'column', alignItems:'flex-start', justifyContent:'center', padding:10, backgroundColor:'#20BE9C'}}>
                                <View style = {{ flexDirection: "row", alignItems: "center" }}>
                                    <Image source = {rupee} style = {{ width: 14, height: 14, marginTop: 2 }}/>
                                    <TextView style={{fontSize:18, color:'#fff', fontWeight:'bold'}}>{price}</TextView>
                                    <TextView style={{fontSize:14, color:'#fff', flex: 1, fontWeight: "bold"}}>
                                        {'  ' +'(' + totalItems + ' Items)'}
                                    </TextView>
                                </View>
                                <TextView style={{fontSize:12, color:'#fff', fontWeight:'bold', width: "100%"}}>{'Total Amount'}</TextView>
                            </TouchableOpacity>
                            <TouchableOpacity disabled={products.length > 0 ? false : true} onPress = {this.proceed} style={{flex:1, flexDirection:'column', alignItems:'center', justifyContent:'center', padding:10, backgroundColor: products.length > 0 ? '#2E7DB9': "#848484"}}>
                                <TextView style={{fontSize:18, color:'#fff', width:'100%',textAlign:'center', fontWeight:'bold'}}>{'Next'}</TextView>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <Modal
                    transparent={true}
                    visible={this.state.rightNavMenuDisplay}
                    animationType="none"
                >
                    <TouchableOpacity style = {{ flex:1, backgroundColor: "transparent"}} onPress = {this.openMenu}>
                        <View style={{width:200, height:100, borderWidth:1, borderColor:'#ccc', position:'absolute', top:45, right:10, borderRadius:10, elevation:10, alignItems:'flex-start', justifyContent:'flex-start', backgroundColor:'#fff', padding:10}}>
                            <TouchableOpacity onPress={this.radioPressedScan} style={{flexDirection:'row', padding:5}}>
                                <TouchableOpacity onPress={this.radioPressedScan} style={[styles.radio, outerStyle]}>
                                    {isSelectedScan ? <View style={innerStyle}/> : null}
                                </TouchableOpacity>
                                <View style={{alignItems:'center', justifyContent:'center'}}>
                                    <TextView style={{color:'#000', fontSize:19, paddingLeft:10, top:2}}>{'Scan To Billing'}</TextView>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.radioPressedManual} style={{flexDirection:'row', padding:5}}>
                                <TouchableOpacity onPress={this.radioPressedManual} style={[styles.radio, outerStyle]}>
                                    {isSelectedManual ? <View style={innerStyle}/> : null}
                                </TouchableOpacity>
                                <View style={{alignItems:'center', justifyContent:'center'}}>
                                    <TextView style={{color:'#000', fontSize:19, paddingLeft:10, top:2}}>{'Manual Billing'}</TextView>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>    
            </SafeAreaView>   
        )
    }
}