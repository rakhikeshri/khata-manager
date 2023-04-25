import React from "react";
import {
    View,
    SafeAreaView,
    ScrollView,
    TextInput,
    KeyboardAvoidingView,
    TouchableOpacity,
    StatusBar
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import CheckBox from "expo-checkbox";
import TextView from "core/TextView";
import { connect } from "react-redux";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from "@expo/vector-icons";
import CustomModal, { ModalFooter, ModalButton, ModalContent } from 'react-native-modals';

import styles from "./styles";
import { createProduct } from "./../../../../../actions/productActions";
import { parseProduct, validateProduct } from "./../../../../../common/productUtils";
import { getFormatedDate } from "./../../../../../common/utils"; 

const mapping = {
    "Name": "name",
    "Description": "description",
    "Available": "availableQuantity",
    "HSN": "hsn",
    "Model No.": "modelNo",
    "SKU": "sku",
    "UPC": "upc",
    "ISBN": "isbn",
    "MPN": "mpn",
    "Discount": "discount",
    "CGST": "cgst",
    "SGST": "sgst",
    // "GST": "gst",
    "Dimension (inches)": "dimension",
    "Weight": "weight",
    "Available Units": "availableUnit", 
    "Expiry": "expiry",
    "MFG": "mfg",
    "Manufacturer": "manufacturer",
    "Min. Stock Threshold": "outOfStockThreshold",
    "Mrp Includes Tax": "mrpIncludesTax",
};

const PlaceHolders = {
    "Name": "Product Name",
    "Description": "You can enter product desc. here",
    "Available": "10",
    "HSN": "",
    "Model No.": "",
    "SKU": "",
    "UPC": "",
    "ISBN": "",
    "MPN": "",
    "Discount": "10%",
    "CGST": "9%",
    "SGST": "9%",
    // "GST": "18%",
    "Dimension (inches)": "dimension",
    "Weight": "weight",
    "Available Units": "availableUnit", 
    "Expiry": "expiry",
    "MFG": "mfg",
    "Manufacturer": "manufacturer",
    "Min. Stock Threshold": "8",
    "Mrp Includes Tax": "mrpIncludesTax",
};

@connect((store) => {
    return {
        user: store.auth.user,
        createProduct: store.products.createProduct
    }
})
export default class AddProduct extends React.Component {
    state = {
        expiryDatePicker: false,
        mfgDatePicker: false,
        editedFields: {},
        editedDimensionFields: {},
        editedWeightInput: {
            unit: "g",
            value: null
        },
        editedMrpIncludesTax: true,
        availableUnits : [],
        smallestUnit: {},
        editedAvailableUnit: {},
        addAvailableUnitDialog: false
    };

    componentDidUpdate = (prevProps) => {
        if (this.props.createProduct !== prevProps.createProduct) {
            if (this.props.createProduct.hasOwnProperty("_id")) {
                alert("Product created successfully!");

                this.setState({
                    expiryDatePicker: false,
                    mfgDatePicker: false,
                    editedFields: {},
                    editedDimensionFields: {},
                    editedMrpIncludesTax: true,
                    editedWeightInput: {
                        unit: "g",
                        value: null
                    },
                    availableUnits : [],
                    smallestUnit: {},
                    editedAvailableUnit: {},
                    addAvailableUnitDialog: false
                })
            }
        }
    }
    
    showDateInput = (label) => {
        if (label === "Expiry") {
            this.setState({
                expiryDatePicker: true
            });
        } else if (label === "MFG") {
            this.setState({
                mfgDatePicker: true
            });
        }
    }

    handleDateInput = (label, value) => {
        const { editedFields } = this.state;

        if (Object.keys(value.nativeEvent).length === 0) {
            return;
        }

        const d = value.nativeEvent.timestamp;
        const selectedDate = new Date(d);
        
        const key = mapping[label];

        editedFields[key] = selectedDate;

        this.setState({
            editedFields,
            expiryDatePicker: false,
            mfgDatePicker: false,
        })
    }

    handleInput = (label, value) => {
        const { editedFields } = this.state;
        const key = mapping[label];

        editedFields[key] = value;

        this.setState({
            editedFields,
            expiryDatePicker: false,
            mfgDatePicker: false,
        })
    }

    handleMrpIncludesTax = () => {
        const { editedMrpIncludesTax } = this.state;

        this.setState({
            editedMrpIncludesTax: !editedMrpIncludesTax
        })
    }

    handleDimensionInput = (label, value) => {
        const { editedDimensionFields } = this.state;

        editedDimensionFields[label] = value;

        this.setState({ editedDimensionFields });
    }

    handleWeightInput = (label, value) => {
        const { editedWeightInput } = this.state;
        editedWeightInput[label] = value;

        this.setState({ editedWeightInput });
    }

    handleAvailableUnitInput = (label, value) => {
        const { editedAvailableUnit } = this.state;
        editedAvailableUnit[label] = value;

        this.setState({ editedAvailableUnit });
    }

    handleAddAvailableUnit = () => {
        const { editedAvailableUnit, availableUnits } = this.state;
        let smallestUnit = this.state.smallestUnit;
        if (availableUnits.length === 0) {
            smallestUnit = editedAvailableUnit;
        }

        availableUnits.push(editedAvailableUnit);


        this.setState({
            availableUnits,
            editedAvailableUnit: {},
            addAvailableUnitDialog: false,
            smallestUnit
        })
    }

    removeAvailableUnit = (index) => {
        const { availableUnits } = this.state;

        availableUnits.splice(index, 1);

        this.setState({ availableUnits });
    }

    selectSmallestUnit = (unit) => {
        const { smallestUnit } = this.state;
        let sUnit = unit;
        if (smallestUnit.label === unit.label) {
            sUnit = {};
        }

        this.setState({
            smallestUnit: sUnit
        })
    }

    getInput = (label) => {
        const { editedFields, editedMrpIncludesTax } = this.state;
        const value = "";
        const calendarInput = [
            "Expiry",
            "MFG"
        ];

        const mandatoryFields = [
            "Name",
            "Available",
            "CGST",
            "SGST",
            "Available Units"
        ];

        const isNumber = [
            "Available",
            "Price",
            "CGST",
            "SGST",
            "GST",
            "Discount",
            "Min. Stock Threshold"
        ];

        if (label === "Dimension (inches)") {
            return (
                <View style = {{marginTop: 10}}>
                    <TextView style = {{ paddingBottom: 8 }}>
                        {label}
                    </TextView>
                    <View style = {{ flexDirection: "row" }}>
                        <TextInput
                            placeholder = "l"
                            onChangeText = {this.handleDimensionInput.bind(this, "l")}
                            keyboardType = {"decimal-pad"}
                            style = {[styles.inputStyle, { marginRight: 10 }]}/>
                        <TextInput
                            placeholder = "b"
                            onChangeText = {this.handleDimensionInput.bind(this, "b")}
                            keyboardType = {"decimal-pad"}
                            style = {[styles.inputStyle, { marginRight: 10 }]}/>
                        <TextInput
                            placeholder = "h"
                            onChangeText = {this.handleDimensionInput.bind(this, "h")}
                            keyboardType = {"decimal-pad"}
                            style = {styles.inputStyle}/>
                    </View>
                </View>
            )
        } else if (label === "Weight") {
            return (
                <View style = {{marginTop: 10}}>
                    <TextView style = {{ paddingBottom: 8 }}>
                        {label}
                    </TextView>
                    <View style = {{ flexDirection: "row" }}>
                        <TextInput
                            placeholder = "100"
                            onChangeText = {this.handleWeightInput.bind(this, "value")}
                            keyboardType = {"decimal-pad"}
                            style = {[styles.inputStyle, { marginRight: 10 }]}/>
                        <Picker 
                            onValueChange={(value) => {
                                this.handleWeightInput("unit", value);
                            }}
                            style = {[styles.inputStyle, { maxWidth: 100 }]}>
                            <Picker.Item label="g" value="g" />
                            <Picker.Item label="kg" value="kg" />
                            <Picker.Item label="l" value="l" />
                            <Picker.Item label="ml" value="ml" />
                        </Picker>
                    </View>
                </View>
            )
        } else if (label === "Mrp Includes Tax") {
            return (
                <View style = {[styles.formRowWrapper, { flexDirection: "row", alignItems: "center", height: 100 }]}>
                    <CheckBox value = {editedMrpIncludesTax} onChange = {this.handleMrpIncludesTax.bind(this)}></CheckBox>
                    <TextView>
                        Mrp Includes Tax
                    </TextView>
                </View>
            );
        } else if (label === "Available") {
            return (
                <View style = {{marginTop: 10}}>
                    <View style = {{ flexDirection: "row" }}>
                        <TextView style = {{ paddingBottom: 8 }}>
                            {label}
                        </TextView>
                        {
                            mandatoryFields.includes(label) ? (
                                <TextView style = {{ paddingBottom: 8, color: "red", fontSize: 16, marginLeft: 10, marginTop: -2 }}>
                                    *
                                </TextView>
                            ): null
                        }
                    </View>
                    <View style = {{ flexDirection: "row" }}>
                        <TextInput
                            editable = { editedFields[mapping[label]] === -1 ? false : true }
                            value = { editedFields[mapping[label]] ? editedFields[mapping[label]].toString() : "" }
                            onChangeText = { this.handleInput.bind(this, label) }
                            placeholder = {PlaceHolders[label]}
                            keyboardType = {isNumber.includes(label) ?  "decimal-pad" : "default"}
                            style = {[styles.inputStyle, {
                                backgroundColor: editedFields[mapping[label]] === -1 ? "lightgrey": "#fff"
                            }]}/>

                        <TouchableOpacity
                            onPress={() => {
                                let value = editedFields[mapping[label]];

                                if (value === -1) {
                                    value = 0;
                                } else {
                                    value = -1;
                                }


                                this.handleInput(label, value)
                            }}
                            style = {{ 
                                width: 44,
                                height: 44,
                                backgroundColor: editedFields[mapping[label]] === -1  ? "#db5185" : "lightgrey",
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 8,
                                marginLeft: 18,
                            }}>
                            <Ionicons name="md-infinite" size={26} color={"#fff"} />
                        </TouchableOpacity>
                    </View>
                </View>
            );
        } else if (label === "Available Units") {
            return (
                <View style = {{marginTop: 10}}>
                    <View style = {{ flexDirection: "row" }}>
                        <TextView style = {{ paddingBottom: 8 }}>
                            {label}
                        </TextView>
                        {
                            mandatoryFields.includes(label) ? (
                                <TextView style = {{ paddingBottom: 8, color: "red", fontSize: 16, marginLeft: 10, marginTop: -2 }}>
                                    * (Create atleast one)
                                </TextView>
                            ): null
                        }
                    </View>
                    <View style = {{ paddingTop: 14, paddingBottom: 14 }}>
                        {
                            this.state.availableUnits.map((unit, index) => {
                                const {smallestUnit} = this.state;
                                let active = false;

                                if (smallestUnit.label === unit.label) {
                                    active = true;
                                }

                                return (
                                    <View style = {{ flexDirection: "row" }}>
                                        <TextView style = {{ height: 30, justifyContent: "center"}}>
                                            - {unit.label}, {unit.cfactor}(CFactor), {unit.rpu}(Rpu)
                                        </TextView>
                                        <TouchableOpacity 
                                            onPress = {this.selectSmallestUnit.bind(this, unit)}
                                            style = {{ 
                                                marginLeft: 30,
                                                width: 80,
                                                height: 24,
                                                backgroundColor: active ? "#db5185" : "#d7d7d7",
                                                borderRadius: 8,
                                                justifyContent: "center",
                                                alignItems: "center"
                                            }}>
                                            <TextView style = {{
                                                color: active? "#fff": "#000"
                                            }}>
                                                Smallest
                                            </TextView>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress = {this.removeAvailableUnit.bind(this, index)}
                                            style = {{
                                                height: 24,
                                                width: 24,
                                                justifyContent: "center",
                                                alignItems: "center",
                                                marginLeft: 40,
                                                borderRadius: 100,
                                                backgroundColor: "grey"
                                            }}>
                                            <TextView style = {{
                                                color: "#fff",
                                                marginTop: -3,
                                                fontSize: 16,
                                            }}>
                                                x
                                            </TextView>
                                        </TouchableOpacity>
                                    </View>
                                )
                            })
                        }
                    </View>
                    <TouchableOpacity
                        onPress = {() => { 
                            const { availableUnits } = this.state;
                            this.setState({ 
                                addAvailableUnitDialog: true,
                                editedAvailableUnit: availableUnits.length === 0 ? {
                                    label: "Unit",
                                    cfactor: 1,
                                    rpu: null
                                }: {}
                            });
                        }}
                        style = {{ 
                            flexDirection: "row",
                            width: 140,
                            height: 40,
                            backgroundColor: "#317db9",
                            borderRadius: 8,
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                        <TextView style = {{
                            color : "#fff"
                        }}>Add Unit</TextView>
                    </TouchableOpacity>
                </View>
            );
        } else if (calendarInput.includes(label)) {
            const { expiryDatePicker, mfgDatePicker } = this.state;
            let check = expiryDatePicker;
            if (label === "MFG") {
                check = mfgDatePicker;
            }

            let date = getFormatedDate(value);
            if (editedFields.hasOwnProperty(mapping[label])) {
                date = getFormatedDate(editedFields[mapping[label]]);
            }

            return (
                <View style = {{marginTop: 10}}>
                    <TextView style = {{ paddingBottom: 8 }}>
                        {label}
                    </TextView>
                    <TouchableOpacity 
                        onPress = { this.showDateInput.bind(this, label) }
                        style = {{
                            flex: 1,
                            maxHeight: 40,
                            borderWidth: 1,
                            borderRadius: 8,
                            padding: 4,
                            backgroundColor: "#efefef",
                            borderColor: "#dedede",
                            flexDirection: "row",
                            alignItems: "center"
                        }}>
                        <Ionicons name="md-calendar" size={28} color={"#000"} style = {{marginLeft: 4}}/>
                        <TextView style = {{marginLeft: 8}}>
                            {date.indexOf("NaN") !== -1 ? "Date" : date}
                        </TextView>
                        {
                            check ? <DateTimePicker
                                testID={label+"_dateTimePicker"}
                                timeZoneOffsetInMinutes={0}
                                value={new Date()}
                                mode={"date"}
                                is24Hour={false}
                                display="default"
                                onChange={this.handleDateInput.bind(this, label)}
                            /> : null
                        }
                    </TouchableOpacity>
                </View>
            )
        } else {
            return (
                <View style = {{marginTop: 10}}>
                    <View style = {{ flexDirection: "row" }}>
                        <TextView style = {{ paddingBottom: 8 }}>
                            {label}
                        </TextView>
                        {
                            mandatoryFields.includes(label) ? (
                                <TextView style = {{ paddingBottom: 8, color: "red", fontSize: 16, marginLeft: 10, marginTop: -2 }}>
                                    *
                                </TextView>
                            ): null
                        }
                    </View>
                    <TextInput
                        value = { editedFields[mapping[label]] ? editedFields[mapping[label]].toString() : "" }
                        onChangeText = { this.handleInput.bind(this, label) }
                        placeholder = {PlaceHolders[label]}
                        keyboardType = {isNumber.includes(label) ?  "decimal-pad" : "default"}
                        style = {styles.inputStyle}/>
                </View>
            );
        }
    }

    closeAddAvailableUnit = () => {
        this.setState({
            addAvailableUnitDialog: false
        })
    }

    submitProduct = () => {
        const {
            editedFields,
            editedDimensionFields,
            editedWeightInput,
            editedMrpIncludesTax,
            availableUnits,
            smallestUnit
        } = this.state;

        const { user, dispatch } = this.props;

        const obj = {
            ...editedFields,
            price: smallestUnit.rpu,
            dimension: editedDimensionFields,
            weight: editedWeightInput,
            gst: parseFloat(editedFields.cgst)+parseFloat(editedFields.sgst),
            availableUnits,
            smallestUnit,
            mrpIncludesTax: editedMrpIncludesTax
        }
        
        const validation = validateProduct(obj);

        if (validation.valid) {
            const product = parseProduct(obj);
            
            dispatch(createProduct(user.accessToken, product));
        } else {
            alert(validation.message);
        }
    }

    render() {
        const { editedAvailableUnit } = this.state;
        return (
            <SafeAreaView style = {styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="#1CBD9C" translucent = {false } />
                {/* <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset = {0} style = {{ flex: 1 }}> */}
                    <ScrollView style = {styles.formWrapper}>
                        {
                            Object.keys(mapping).map((label) => {
                                return this.getInput(label);
                            })
                        }
                        <View style = {{ height: 100, width: "100%" }}></View>
                    </ScrollView>
                {/* </KeyboardAvoidingView> */}
                <View style = {styles.footerWrapper}>
                    <TouchableOpacity
                        onPress = { this.submitProduct }
                        style = { styles.buttonContainer }>
                        <TextView style = {{ fontSize: 16, color: "#fff" }}>
                            Submit
                        </TextView>
                    </TouchableOpacity>
                </View>
                {/* Modal popup */}
                <CustomModal
                    visible={this.state.addAvailableUnitDialog}
                    footer={
                        <ModalFooter>
                            <ModalButton
                                text="Cancel"
                                onPress={ this.closeAddAvailableUnit }
                                textStyle={{ color: '#fff' }}
                                style={{ backgroundColor: '#317db9' }}
                            />
                            <ModalButton
                                text="Add"
                                onPress={ this.handleAddAvailableUnit }
                                textStyle={{ color: '#fff' }}
                                style={{ backgroundColor: '#22bf9c' }}
                            />
                        </ModalFooter>
                    }
                >
                    <ModalContent style={styles.scanMoreModalContainer}>
                        <View style = {{
                            width: 300,
                            height: 250
                        }}>
                            <View style = {{ height: 76 }}>
                                <TextView style = {{ marginBottom: 8, marginTop: 8 }}>
                                    Label
                                </TextView>
                                <TextInput
                                    placeholder = "Strips"
                                    value = { editedAvailableUnit.label }
                                    onChangeText = { this.handleAvailableUnitInput.bind(this, "label") }
                                    style = {[styles.inputStyle]}/>
                            </View>
                            <View style = {{ height: 76 }}>
                                <TextView style = {{ marginBottom: 8, marginTop: 8 }}>
                                    Conversion Factor
                                </TextView>
                                <TextInput
                                    placeholder = "10"
                                    value = { typeof editedAvailableUnit.cfactor !== "string" ? parseFloat(editedAvailableUnit.cfactor) : editedAvailableUnit.cfactor }
                                    onChangeText = { this.handleAvailableUnitInput.bind(this, "cfactor") }
                                    keyboardType = {"decimal-pad"}
                                    style = {[styles.inputStyle]}/>
                            </View>
                            <View style = {{ height: 76 }}>
                                <TextView style = {{ marginBottom: 8, marginTop: 8 }}>
                                    Rate Per Unit
                                </TextView>
                                <TextInput
                                    placeholder = "20"
                                    value = { editedAvailableUnit.rpu }
                                    onChangeText = { this.handleAvailableUnitInput.bind(this, "rpu") }
                                    keyboardType = {"decimal-pad"}
                                    style = {[styles.inputStyle]}/>
                            </View>
                        </View>
                    </ModalContent>
                </CustomModal>
            </SafeAreaView>
        )
    }
}