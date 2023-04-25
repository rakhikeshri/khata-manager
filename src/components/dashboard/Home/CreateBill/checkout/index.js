import React from "react";
import { connect } from "react-redux";
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  Image,
  FlatList,
  StatusBar
} from "react-native";
import TextView from "core/TextView";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';

import { getFormatedDateTime, getFormatedDate } from "./../../../../../common/utils";
// style
import styles from "./styles";

import {
  appendPaymentDetails,
  formatOrderPayload,
  calculateSellingPrice,
  calculateDiscount,
  calculateTax,
  appendInvoiceDate
} from "./../../../../../common/orderUtils";

// Spinner
import Spinner from "../../../../core/Spinner";

// actions
import {
  addProductToBill,
  createOrder
} from "./../../../../../actions/orderAction";

const rupee = require("./../../../../../../assets/images/rupee.png");

@connect(store => {
  return {
    user: store.auth.user,
    scanned: store.orders.scanned,
    createBillPayload: store.orders.createBillPayload,
    createOrder: store.orders.createOrder
  };
})
export default class Checkout extends React.Component {
  state = {
    scanned: false,
    scannerOpen: false,
    scanMoreModal: false,
    isWaiting: true,
    showDateTimePicker: false,
    invoiceDate: new Date(),
    proceed: false
  };

  componentDidMount() {
    const { navigation } = this.props;

    navigation.setOptions({
      headerRight: this.getInvoiceCalendar
    })

    this.setState({ isWaiting: false });
  }

  getInvoiceCalendar = () => {
    const now = Date.now();
    const formatedNow = getFormatedDateTime(now);

    return (
      <TouchableOpacity 
          style = {{
              width: 140,
              height: 58,
              alignItems: "center",
              justifyContent: "center"
          }}
          onPress = {this.openCalendar}
      >
          <View style = {{ flexDirection: "row", alignItems: "center" }}>
            <TextView style = {{ textAlign: "center", width: 100, color: "#ffffff"}}>
              {formatedNow}
            </TextView>
            <View style = {{width: 40, alignContent: "center"}}>
              <Ionicons name="md-calendar" size={20} color={"#fff"} />
            </View>
          </View>
      </TouchableOpacity>
    );
  }

  componentDidUpdate = prevProps => {
    if (this.props.createBillPayload !== prevProps.createBillPayload && this.state.proceed) {
      const { createBillPayload, user } = this.props;
      
      const orderPayload = formatOrderPayload(createBillPayload);

      // create bill
      this.props.dispatch(createOrder(orderPayload, user.accessToken));
    }

    if (this.props.createOrder !== prevProps.createOrder) {
      const { createOrder, navigation } = this.props;
      if (createOrder.hasOwnProperty("_id")) {
        navigation.navigate("Success");
      } else {
        alert("Server Busy");
      }
    };
  }

  openCalendar = () => {
    this.setState({
      showDateTimePicker: true
    })
  }
  
  proceed = () => {
    const { route } = this.props;
    const paymentStages = route?.params.paymentStages;
    const paymentStatus = route?.params.paymentStatus;

    const newCustomerPayload = appendPaymentDetails(
      paymentStages,
      paymentStatus
    );

    this.setState({isWaiting:true, proceed: true},()=>{
      this.props.dispatch(addProductToBill(newCustomerPayload));
    });
  };

  setInvoiceDate = (event, selectedDate) => {
    if (!selectedDate) {
      this.setState({
        showDateTimePicker: false
      })

      return;
    }
    
    const d = new Date(selectedDate);
    const { navigation } = this.props;

    
    this.setState({
      invoiceDate: d,
      showDateTimePicker: false
    }, () => {
      navigation.setParams({
        now: getFormatedDateTime(d)
      });

      const fd = getFormatedDate(d);
      const arr = fd.split("/");

      const newCustomerPayload = appendInvoiceDate(arr[2]+"/"+arr[1]+"/"+arr[0]);
      this.props.dispatch(addProductToBill(newCustomerPayload));
    })
  };

  getSelectedUnit = product => {
    let selectedUnit = {};
    if (
      Object.keys(product.selectedUnit).length !== 0 &&
      product.availableUnits.length !== 0
    ) {
      product.availableUnits.map(unit => {
        if (unit.label === product.selectedUnit) {
          selectedUnit = unit;
        }
      });
    } else if (
      product.availableUnits.length === 0 &&
      Object.keys(product.smallestUnit).length !== 0
    ) {
      selectedUnit = product.smallestUnit;
    } else {
      selectedUnit = {
        label: "Pack",
        cfactor: 1,
        rpu: product.mrp
      };
    }

    return selectedUnit;
  };

  total = () => {
    const { createBillPayload } = this.props;
    const { products } = createBillPayload;

    let totalDiscount = 0;
    let totalTax = 0;
    let grandTotal = 0;
    let totalItems = 0;

    products.map(product => {
      const selectedUnit = product.type === "Custom" ? product.selectedUnit : this.getSelectedUnit(product);

      const total = calculateSellingPrice(
        selectedUnit.rpu || product.mrp,
        product.sgst,
        product.cgst,
        product.gst,
        product.discount || 0,
        product.customDiscount,
        product.qty,
        product.mrpIncludesTax
      );

      let { customDiscount } = product;

      if (
        typeof product.customDiscount === "string" &&
        product.customDiscount.length !== 0
      ) {
        customDiscount = parseFloat(product.customDiscount);
      } else if (
        typeof product.customDiscount === "string" &&
        product.customDiscount.length === 0
      ) {
        customDiscount = 0;
      }

      const discount = calculateDiscount(
        selectedUnit.rpu || product.mrp,
        product.qty,
        product.discount,
        customDiscount
      );

      const tax = calculateTax(
        total,
        product.sgst,
        product.cgst,
        product.gst,
        product.mrpIncludesTax
      );

      const numberOfItems = product.qty;

      grandTotal += total;
      totalDiscount += discount;
      totalTax += tax;
      totalItems += numberOfItems;
    });

    return {
      discount: totalDiscount,
      tax: totalTax,
      total: grandTotal,
      totalItems
    };
  };

  render() {
    const { createBillPayload } = this.props;
    const { products } = createBillPayload;
    const { isWaiting, showDateTimePicker, invoiceDate } = this.state;
    const total = this.total();

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" backgroundColor="#1CBD9C" translucent = {false } />
        {
          showDateTimePicker ? (
            <DateTimePicker
              testID="dateTimePicker"
              timeZoneOffsetInMinutes={0}
              value={invoiceDate}
              mode={"date"}
              is24Hour={false}
              display="default"
              onChange={this.setInvoiceDate}
            />
          ) : null
        }
        {isWaiting && <Spinner />}
        <View style={styles.container}>
          <FlatList
            data={products}
            style={{ flex: 1 }}
            renderItem={({ item, index }) => {
              const selectedUnit = this.getSelectedUnit(item);
              const price = selectedUnit.rpu || item.price;
              let discount =
                (price * item.discount * item.qty) / 100 +
                (parseFloat(item.customDiscount) || 0);

              discount = discount.toString().indexOf(".") !== -1 ? discount.toFixed(2) : discount
              return (
                <View>
                  <TouchableOpacity style={styles.product}>
                    <View style={{ flex: 1, flexDirection: "row" }}>
                      <View
                        style={{
                          flex: 4,
                          flexDirection: "column",
                          paddingLeft: 15
                        }}
                      >
                        <View style={{ flex: 1, flexDirection: "column" }}>
                          <View style={{ flex: 1, flexDirection: "row" }}>
                            <TextView
                              style={{
                                fontSize: 14,
                                color: "#282828",
                                fontWeight: "bold"
                              }}
                            >
                              {item.name}
                            </TextView>
                          </View>
                          <View style={{ flex: 1 }}>
                            <TextView style={{ fontSize: 12, color: "#282828" }}>
                              {item.manufacturer}
                            </TextView>
                          </View>
                        </View>
                        <View
                          style={{
                            flex: 1,
                            flexDirection: "row",
                            paddingTop: 7,
                            paddingBottom: 2
                          }}
                        >
                          <View style={{ flex: 3, flexDirection: "column" }}>
                            <TextView
                              style={{
                                fontSize: 14,
                                color: "#9e9e9e",
                                fontWeight: "bold",
                              }}
                            >
                              {item.weight?.value}
                              {item.weight?.unit}
                            </TextView>
                          </View>
                          <View style={{ flex: 5, flexDirection: "row" }}>
                            <View style={{}}>
                              <TextView
                                style={{
                                  fontSize: 14,
                                  color: "#9e9e9e",
                                  fontWeight: "bold"
                                }}
                              >
                                {"Quantity : "}
                              </TextView>
                            </View>
                            <View style={{ flex: 1 }}>
                              <TextView
                                style={{
                                  fontSize: 14,
                                  color: "#000",
                                  fontWeight: "bold"
                                }}
                              >
                                {item.qty}
                              </TextView>
                            </View>
                          </View>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            paddingTop: 2,
                            paddingBottom: 2
                          }}
                        >
                          <View style={{ flex: 3, flexDirection: "column" }}>
                            <TextView
                              style={{
                                fontSize: 14,
                                color: "#242424",
                                fontWeight: "bold"
                              }}
                            >
                              ₹ {price * item.qty}
                            </TextView>
                          </View>
                          <View style={{ flex: 5, flexDirection: "column" }}>
                            <TextView
                              style={{
                                fontSize: 14,
                                color: "#1abc9c",
                                fontWeight: "bold"
                              }}
                            >
                              Discount: ₹ {discount}{" "}
                            </TextView>
                          </View>
                        </View>
                      </View>
                      <View style={{ flex: 1, flexDirection: "column" }}>
                        <View
                          style={{
                            flex: 1,
                            alignItems: "flex-end",
                            justifyContent: "flex-end"
                          }}
                        ></View>
                        <View
                          style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "flex-end"
                          }}
                        >
                          <View
                            style={{
                              backgroundColor: "#E9E9E9",
                              borderRadius: 4,
                              flexDirection: "row",
                              paddingHorizontal: 10,
                              paddingVertical: 5
                            }}
                          >
                            <TextView
                              style={{
                                fontSize: 12,
                                color: "#9e9e9e",
                                fontWeight: "bold"
                              }}
                            >
                              {"Unit : "}
                            </TextView>
                            <TextView
                              style={{
                                fontSize: 12,
                                color: "#000",
                                fontWeight: "bold"
                              }}
                            >
                              {item.smallestUnit?.label}
                            </TextView>
                          </View>
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
              );
            }}
            keyExtractor={item => item._id}
          />
          <View
            style={{
              width: "100%",
              position: "absolute",
              justifyContent: "center",
              bottom: 0
            }}
          >
            <View style={{ flex: 1, flexDirection: "row" }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "center",
                  padding: 10,
                  backgroundColor: "#20BE9C"
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    flex: 1
                  }}
                >
                  <TextView style={{ fontSize: 14, color: "#fff", flex: 3 }}>
                    {"Discount"}
                  </TextView>
                  <View
                    style={{
                      flexDirection: "row",
                      flex: 4,
                      alignItems: "center"
                    }}
                  >
                    <Image
                      source={rupee}
                      style={{ width: 14, height: 14, marginTop: 2 }}
                    />
                    <TextView
                      style={{
                        fontSize: 14,
                        color: "#fff",
                        fontWeight: "bold",
                        flex: 4,
                        paddingLeft: 3
                      }}
                    >
                      {total.discount.toFixed(2)}
                    </TextView>
                  </View>
                </View>
                <View
                  style={{ flexDirection: "row", alignItems: "flex-start" }}
                >
                  <TextView style={{ fontSize: 14, color: "#fff", flex: 3 }}>
                    {"Tax"}
                  </TextView>
                  <View
                    style={{
                      flexDirection: "row",
                      flex: 4,
                      alignItems: "center"
                    }}
                  >
                    <Image
                      source={rupee}
                      style={{ width: 14, height: 14, marginTop: 2 }}
                    />
                    <TextView
                      style={{
                        fontSize: 14,
                        color: "#fff",
                        fontWeight: "bold",
                        flex: 4,
                        paddingLeft: 3
                      }}
                    >
                      {total.tax.toFixed(2)}
                    </TextView>
                  </View>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <TextView style={{ fontSize: 14, color: "#fff", flex: 3 }}>
                    {"Total"}
                  </TextView>
                  <View
                    style={{
                      flexDirection: "row",
                      flex: 4,
                      alignItems: "center"
                    }}
                  >
                    <Image
                      source={rupee}
                      style={{ width: 14, height: 14, marginTop: 2 }}
                    />
                    <TextView
                      style={{
                        fontSize: 14,
                        color: "#fff",
                        fontWeight: "bold",
                        flex: 1,
                        paddingLeft: 3
                      }}
                    >
                      {total.total.toFixed(2)}
                    </TextView>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={!(products.length > 0) || isWaiting}
                onPress={this.proceed}
                style={{
                  flex: 1,
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 10,
                  backgroundColor: products.length > 0 ? "#2E7DB9" : "#848484"
                }}
              >
                <TextView
                  style={{
                    fontSize: 16,
                    color: "#fff",
                    width: "100%",
                    textAlign: "center",
                    fontWeight: "bold"
                  }}
                >
                  {"Generate"}
                </TextView>
                <TextView
                  style={{
                    fontSize: 14,
                    color: "#fff",
                    width: "100%",
                    textAlign: "center",
                    fontWeight: "bold"
                  }}
                >
                  {"(" + total.totalItems + " Items )"}
                </TextView>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
