import React from "react";
import {
    View,
    TouchableOpacity, 
    SafeAreaView,
    ScrollView,
    TextInput,
    KeyboardAvoidingView,
    StatusBar
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import CustomModal, { ModalFooter, ModalButton, ModalContent } from 'react-native-modals';
import TextView from "core/TextView";

import { connect } from "react-redux";
import DateTimePicker from '@react-native-community/datetimepicker';

import { Ionicons } from "@expo/vector-icons";
import { getFormatedDate } from "./../../../../../common/utils"; 
import { parseProduct, updateLocalProductList } from "./../../../../../common/productUtils";
import { updateProduct } from "./../../../../../actions/productActions";

import styles from "./styles";

@connect((store) => {
    return {
        user: store.auth.user,
        updateProduct: store.products.updateProduct
    }
})
export default class ProductDetail extends React.Component {
    state = {
        product : this.props.route?.params.product,
        isWaiting:true,
        edit: false,
        editedFields: {},
        editedDimensionInput: {},
        editedWeightInput: {},
        expiryDatePicker: false,
        mfgDatePicker: false,
        addAvailableUnitDialog: false,
        availableUnits: [],
        smallestUnit: {},
        editedAvailableUnit: {
            label: "Unit",
            cfactor: 1,
            rpu: null
        },
        keyLabelMapping: {
            "Name": "name",
            "PID": "pid",
            "Description": "description",
            "Available": "availableQuantity",
            "HSN": "hsn",
            "Category": "category",
            "Model No.": "modelNo",
            "SKU": "sku",
            "UPC": "upc",
            "ISBN": "isbn",
            "MPN": "mpn",
            "Discount": "discount",
            "CGST": "cgst",
            "SGST": "sgst",
            // "GST": "gst",
            "Available Units": "availableUnits",
            "Dimension": "dimension",
            "Weight": "weight",
            "Expiry": "expiry",
            "MFG": "mfg",
            "Manufacturer": "manufacturer"
        }
    }

    componentDidMount(){
        const actions = [{
            action: this.edit,
            icon: "md-create",
            iconSize: 28
        }];

        this.props.navigation.setOptions(this.getActionContainers(actions));

        // set availableUnits
        const { product } = this.state;
        const { availableUnits, smallestUnit } = product;

        this.setState({
            isWaiting:false,
            availableUnits,
            smallestUnit
        })
    }

    getActionContainers = (actions) => {
        if (actions) {
            return {
                headerRight: () => actions.map((actionItem) => {
                    return (
                        <TouchableOpacity 
                            style = {{
                                width: 60,
                                height: 58,
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                            onPress = {actionItem.action}
                        >
                            <Ionicons name = {actionItem.icon} size={actionItem.iconSize} color={"#fff"} />
                        </TouchableOpacity>
                    )
                })
            };
        } else {
            return { headerRight: {} };
        }
    }

    componentDidUpdate = (prevProps) => {
        if (this.props.updateProduct !== prevProps.updateProduct) {
            const { updateProduct } = this.props;
            
            if (updateProduct.nModified === 1) {
                const {
                    product,
                    editedDimensionInput,
                    editedWeightInput,
                    smallestUnit,
                    availableUnits
                } = this.state;
                let editedFields = this.state.editedFields
                const pid = product.pid;

                if (Object.keys(editedDimensionInput).length !== 0) {
                    editedFields = {
                        ...editedFields,
                        dimension : editedDimensionInput
                    }
                }

                if (Object.keys(editedWeightInput).length !== 0) {
                    editedFields = {
                        ...editedFields,
                        weight : editedWeightInput
                    }
                }

                if (Object.keys(smallestUnit).length !== 0 && smallestUnit.rpu.toString().length !== 0) {
                    editedFields = {
                        ...editedFields,
                        smallestUnit
                    }
                }
        
                if (availableUnits.length !== 0 && smallestUnit.rpu.toString().length !== 0) {
                    editedFields = {
                        ...editedFields,
                        availableUnits
                    }
                }

                this.setState({
                    edit: false,
                    expiryDatePicker: false,
                    mfgDatePicker: false,
                    product: {
                        ...product,
                        ...parseProduct(editedFields)
                    },
                    editedFields: {},
                }, () => {
                    
                    updateLocalProductList(pid, parseProduct(editedFields));
                    const actions = [{
                        action: this.edit,
                        icon: "md-create",
                        iconSize: 28
                    }];
                    this.props.navigation.setOptions(this.getActionContainers(actions));
                });
            } else {
                alert("Couldn't update product! ", JSON.stringify(this.props.updateProduct));
            }
        }
    }

    edit = () => {
        const { product } = this.state;

        this.setState({
            edit: true,
            expiryDatePicker: false,
            mfgDatePicker: false,
            editedFields: {},
            editedDimensionInput: {
                ...product.dimension
            },
            editedWeightInput: {
                ...product.weight
            }
        }, () => {
            const actions = [
                {
                    action: this.cancelEdit,
                    icon: "md-close",
                    iconSize: 26
                },
                {
                    action: this.update,
                    icon: "ios-checkmark",
                    iconSize: 40
                }
            ];
            this.props.navigation.setOptions(this.getActionContainers(actions));
        })
    }

    update = () => {
        const {
            product,
            editedDimensionInput,
            editedWeightInput,
            smallestUnit,
            availableUnits
        } = this.state;
        let editedFields = this.state.editedFields;
        const { dispatch, user } = this.props;
        const pid = product.pid;

        if (Object.keys(editedDimensionInput).length !== 0) {
            editedFields = {
                ...editedFields,
                dimension : {
                    ...editedDimensionInput
                }
            }
        }

        if (Object.keys(editedWeightInput).length !== 0) {
            editedFields = {
                ...editedFields,
                weight : {
                    ...editedWeightInput
                }
            }
        }

        if (Object.keys(smallestUnit).length !== 0 && smallestUnit.rpu.toString().length !== 0) {
            editedFields = {
                ...editedFields,
                smallestUnit
            }
        }

        if (availableUnits.length !== 0 && smallestUnit.rpu.toString().length !== 0) {
            editedFields = {
                ...editedFields,
                availableUnits
            }
        }
        
        if (Object.keys(editedFields).length !== 0) {
            const parsedProduct = parseProduct(editedFields);
            
            const token = user.accessToken;
            dispatch(updateProduct(token, pid, parsedProduct));
        }

        this.setState({
            expiryDatePicker: false,
            mfgDatePicker: false,
        })
    }

    cancelEdit = () => {
        this.setState({
            edit: false,
            expiryDatePicker: false,
            mfgDatePicker: false,
            editedFields: {},
            editedDimensionInput: {},
            editedWeightInput: {}
        }, () => {
            const actions = [{
                action: this.edit,
                icon: "md-create",
                iconSize: 28
            }]
            this.props.navigation.setOptions(this.getActionContainers(actions));
        });
    }

    handleInput = (label, value) => {
        const { keyLabelMapping, editedFields } = this.state;
        const key = keyLabelMapping[label];

        editedFields[key] = value;

        this.setState({
            editedFields,
            expiryDatePicker: false,
            mfgDatePicker: false,
        })
    }

    handleDateInput = (label, value) => {
        const { editedFields, keyLabelMapping } = this.state;

        if (Object.keys(value.nativeEvent).length === 0) {
            return;
        }

        const d = value.nativeEvent.timestamp;
        const selectedDate = new Date(d);
        
        const key = keyLabelMapping[label];

        editedFields[key] = selectedDate;

        this.setState({
            editedFields,
            expiryDatePicker: false,
            mfgDatePicker: false,
        })
    }

    showDateInput = (label) => {
        if (label === "Expiry") {
            this.setState({
                expiryDatePicker: true
            })
        } else if (label === "MFG") {
            this.setState({
                mfgDatePicker: true
            })
        }
    }

    handleDimensionInput = (type, value) => {
        const { editedDimensionInput } = this.state;
        
        editedDimensionInput[type] = value;

        this.setState({editedDimensionInput});
    }

    handleWeightInput = (type, value) => {
        const { editedWeightInput } = this.state;
        
        editedWeightInput[type] = value;

        this.setState({editedWeightInput});
    }

    selectSmallestUnit = (unit) => {
        const { smallestUnit } = this.state;
        let sUnit = unit;
        if (smallestUnit.label === unit.label &&
            smallestUnit.cfactor === unit.cfactor &&
            smallestUnit.rpu === unit.rpu) {
            sUnit = {};
        }
        
        this.setState({
            smallestUnit: sUnit
        })
    }

    removeAvailableUnit = (index) => {
        const { availableUnits } = this.state;

        availableUnits.splice(index, 1);

        const newAvailableUnits = Object.assign([], availableUnits);

        this.setState({ 
            availableUnits: newAvailableUnits
        });
    }

    closeAddAvailableUnit = () => {
        this.setState({
            addAvailableUnitDialog: false
        })
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

    handleAvailableUnitInput = (label, value) => {
        const { editedAvailableUnit } = this.state;
        editedAvailableUnit[label] = value;

        this.setState({ editedAvailableUnit });
    }

    getInput = (label, value) => {
        const {
            editedFields,
            keyLabelMapping,
            product,
            availableUnits,
            smallestUnit
        } = this.state;
        const notEditables = [
            "PID"
        ];

        const calendarInput = [
            "Expiry",
            "MFG"
        ];

        const isNumber = [
            "Available",
            "Price",
            "CGST",
            "SGST",
            "GST",
            "Discount"
        ];

        let enabled = true;

        // if value is " - "
        if (value === " - ") {
            value = "";
        }

        // if value is number
        if (isNumber.includes(label)) {
            value = value.toString();
        }

        // if disabled
        if (notEditables.includes(label)) {
            enabled = false;
        }

        // if value already being edited
        const key = keyLabelMapping[label];

        if (editedFields.hasOwnProperty(key)) {
            value = editedFields[key];
        }

        if (label === "Available") {
            return (
                <View style = {{
                    height: 40,
                    flexDirection: "row"
                }}>
                    <TextInput 
                        value = {value.toString()}
                        editable={value < 0 || editedFields[key] < 0 ? false : true}
                        onChangeText = {this.handleInput.bind(this, label)}
                        style = {{
                            flex: 1,
                            maxHeight: 40,
                            borderWidth: 1,
                            borderRadius: 8,
                            padding: 4,
                            backgroundColor: value < 0 || editedFields[key] < 0 ? "#efefef": "transparent",
                            borderColor: "#dedede"
                        }}
                    />

                    <TouchableOpacity
                        onPress={() => {  
                            if (parseInt(value) === -1 && product[key] === -1) {
                                value = 0;
                            } else if (value >= 0) {
                                value = -1;
                            } else if (value === -1) {
                                value = product[key];
                            }

                            this.handleInput(label, value);
                        }}
                        style = {{ 
                            width: 40,
                            height: 40,
                            backgroundColor: value < 0 ? "#db5185" : "lightgrey",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 8,
                            marginLeft: 12,
                        }}>
                        <Ionicons name="md-infinite" size={26} color={"#fff"} />
                    </TouchableOpacity>
                </View>
            )
        } else if (label === "Weight") {
            const { editedWeightInput } = this.state;
            return (
                <View style = {{ flexDirection: "row" }}>
                    <TextInput 
                        value = {editedWeightInput.value ? editedWeightInput.value.toString() : "" }
                        editable={enabled}
                        onChangeText = {(value) => {
                            this.handleWeightInput("value", value);
                        }}
                        style = {{
                            flex: 1,
                            maxHeight: 40,
                            borderWidth: 1,
                            borderRadius: 8,
                            padding: 4,
                            backgroundColor: !enabled ? "#efefef": "transparent",
                            borderColor: "#dedede"
                        }}
                    />
                    <Picker 
                        onValueChange={(value) => {
                            this.handleWeightInput("unit", value);
                        }}
                        selectedValue = {editedWeightInput.unit}
                        style = {{
                            flex: 1,
                            height: 44,
                            borderWidth: 1,
                            borderRadius: 8,
                            padding: 8,
                            borderColor: "#dedede",
                            flexDirection: "row",
                            alignItems: "center",
                            maxWidth: 140
                        }}>
                        <Picker.Item label="g" value="g" />
                        <Picker.Item label="kg" value="kg" />
                        <Picker.Item label="l" value="l" />
                        <Picker.Item label="ml" value="ml" />
                    </Picker>
                </View>
            );
        } else if (label === "Available Units") {
            const { edit } = this.state;
            return (
                <View style = {{marginTop: 10}}>
                    <TextView style = {{ paddingBottom: 8, fontWeight: "bold" }}>
                        {label}
                    </TextView>
                    <View style = {{ paddingTop: 14, paddingBottom: 14 }}>
                        {
                            availableUnits.map((unit, index) => {
                                let active = false;

                                if (smallestUnit.label === unit.label) {
                                    active = true;
                                }

                                return (
                                    <View style = {{ flexDirection: "row" }}>
                                        <TextView style = {{height: 30, justifyContent: "center"}}>
                                            - {unit.label}, {unit.cfactor}(CFactor), {unit.rpu}(Rpu)
                                        </TextView>
                                        {
                                            edit ? (
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
                                            ) : active ? (
                                                <View 
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
                                                </View>
                                            ) : null
                                        }
                                        {
                                            edit ? (
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
                                            ) : null
                                        }
                                    </View>
                                )
                            })
                        }
                    </View>
                    {
                        edit ? (
                            <TouchableOpacity
                                onPress = {() => { 
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
                        ) : null
                    }
                </View>
            );
        } else if (label === "Dimension") {
            const { editedDimensionInput } = this.state;
            return (
                <View style = {{flexDirection: "row", height: 40}}>
                    <TextInput 
                        value = {editedDimensionInput["l"] ? editedDimensionInput["l"].toString() : ""}
                        placeholder = "l"
                        editable={enabled}
                        onChangeText = {this.handleDimensionInput.bind(this, "l")}
                        style = {{
                            flex: 1,
                            marginRight: 4,
                            maxHeight: 40,
                            borderWidth: 1,
                            borderRadius: 8,
                            padding: 4,
                            backgroundColor: !enabled ? "#efefef": "transparent",
                            borderColor: "#dedede"
                        }}
                    />
                    <TextInput 
                        value = {editedDimensionInput["b"] ? editedDimensionInput["b"].toString() : ""}
                        placeholder = "b"
                        editable={enabled}
                        onChangeText = {this.handleDimensionInput.bind(this, "b")}
                        style = {{
                            flex: 1,
                            maxHeight: 40,
                            marginRight: 4,
                            borderWidth: 1,
                            borderRadius: 8,
                            padding: 4,
                            backgroundColor: !enabled ? "#efefef": "transparent",
                            borderColor: "#dedede"
                        }}
                    />
                    <TextInput 
                        value = {editedDimensionInput["h"] ? editedDimensionInput["h"].toString() : ""}
                        placeholder = "h"
                        editable={enabled}
                        onChangeText = {this.handleDimensionInput.bind(this, "h")}
                        style = {{
                            flex: 1,
                            maxHeight: 40,
                            borderWidth: 1,
                            borderRadius: 8,
                            padding: 4,
                            backgroundColor: !enabled ? "#efefef": "transparent",
                            borderColor: "#dedede"
                        }}
                    />
                </View>
            );
        } else if (calendarInput.includes(label)) {
            const { expiryDatePicker, mfgDatePicker } = this.state;
            let check = expiryDatePicker;
            if (label === "MFG") {
                check = mfgDatePicker;
            }

            let date = getFormatedDate(value);
            if (editedFields.hasOwnProperty(keyLabelMapping[label])) {
                date = getFormatedDate(editedFields[keyLabelMapping[label]]);
            }

            if (value.length === 0) {
                date = "Date"
            }

            return (
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
                        {date}
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
            )
        } else {
            return (
                <TextInput 
                    value = {value}
                    editable={enabled}
                    onChangeText = {this.handleInput.bind(this, label)}
                    style = {{
                        flex: 1,
                        maxHeight: 40,
                        borderWidth: 1,
                        borderRadius: 8,
                        padding: 4,
                        backgroundColor: !enabled ? "#efefef": "transparent",
                        borderColor: "#dedede"
                    }}
                />
            )
        }
    }

    render() {
        const {
            product,
            keyLabelMapping,
            edit,
            editedAvailableUnit
        } = this.state;

        return (
            <SafeAreaView style = {{
                flex: 1,
                paddingTop: 14,
            }}>
                <StatusBar barStyle="dark-content" backgroundColor="#1CBD9C" translucent = {false } />
                <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset = {90}>
                    <ScrollView>
                        {
                            Object.keys(keyLabelMapping).map((label) => {
                                let value = product[keyLabelMapping[label]];

                                if(value && typeof value !== "string") {
                                    if(value.hasOwnProperty("l")) {
                                        value = value.l+" x "+value.b+" x "+value.h;
                                    }

                                    if(value.hasOwnProperty("unit")) {
                                        value = value.value+" "+value.unit;
                                    }
                                }

                                if (!value || value.length === 0) {
                                    value = " - ";
                                }

                                if(value < 0){
                                    value = <Ionicons name="md-infinite" size={33} color={"#000"} /> 
                                }

                                // Available
                                if (label === "Available") {
                                    value = product[keyLabelMapping[label]]
                                }

                                if (label !== "Available Units") {
                                    return (
                                        <View style = {{
                                            // height: 50,
                                            width: "100%",
                                            flexDirection: "row"
                                        }}>
                                            <View style = {{
                                                flex: 2,
                                                minHeight: 50,
                                                justifyContent: "center",
                                                paddingLeft: 14,
                                                paddingRight: 14,
                                                fontSize: 16
                                            }}>
                                                <TextView style = {{
                                                    fontSize: 16,
                                                }}>
                                                    {label}
                                                </TextView>
                                            </View>
                                            <View style = {{
                                                flex: 3,
                                                minHeight: 50,
                                                justifyContent: "center",
                                                paddingLeft: 14,
                                                paddingRight: 14
                                            }}>
                                                {
                                                    edit ? this.getInput(
                                                            label,
                                                            value
                                                        ) : (
                                                            <TextView style = {{
                                                                fontSize: 16,
                                                                fontWeight: "bold"
                                                            }}>
                                                                {label === "Expiry" || label === "MFG" ? 
                                                                    (value !== " - " ? getFormatedDate(value): value )
                                                                : value}
                                                            </TextView>
                                                        )
                                                }
                                            </View>
                                        </View>
                                    )
                                } else {
                                    return (
                                        <View style = {{
                                            paddingTop: 20,
                                            paddingBottom: 20,
                                            width: "100%",
                                            flexDirection: "row",
                                            paddingLeft: 14,
                                            paddingRight: 14
                                        }}>
                                            <View>
                                                {
                                                    this.getInput(
                                                        label,
                                                        value
                                                    )
                                                }
                                            </View>
                                        </View>
                                    )
                                }
                            })
                        }
                        {/* empty */}
                        <View style = {{
                            height: 80,
                            width: "100%"
                        }}>

                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
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
        );
    }
}