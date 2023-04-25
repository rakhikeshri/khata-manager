import React from "react";
import { connect } from "react-redux";
import {
    View,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Keyboard,
    StatusBar
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import TextView from "core/TextView";
import styles from "./styles";

import { validateAndParseCustomer } from "./../../../../../common/customerUtils";

// actions
import { saveCustomer } from "./../../../../../actions/customerAction";

@connect((store) => {
    return {
        user: store.auth.user,
    }
})

export default class AddCustomer extends React.Component {
    state = {
        customer: {
            name: "",
            phone: "",
            gender: "Select",
            email: "",
            address: ""
        }
    }

    handleInput = (type, value) => {
        const { customer } = this.state;

        const newCustomer = {
            ...customer,
            [type]: value
        };

        this.setState({
            customer: newCustomer
        })
    }

    saveCustomer = () => {
        const { customer } = this.state;
        const { dispatch, user } = this.props;
        
        try {
            const c = validateAndParseCustomer(customer);
            dispatch(saveCustomer(user.accessToken, c)).then(() => {
                this.setState({
                    customer: {
                        name: "",
                        phone: "",
                        gender: "Select",
                        email: "",
                        address: ""
                    }
                }, () => {
                    alert("Customer successfully saved.")
                })
            })
        } catch (e) {
            alert(e);
        }
        Keyboard.dismiss()
    }

    render() {
        const { customer } = this.state;
        return (
            <SafeAreaView style = {styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="#1CBD9C" translucent = {false } />
                <ScrollView 
                    keyboardShouldPersistTaps = { "always"}
                    contentContainerStyle = {{ 
                        paddingLeft: 20,
                        paddingRight: 20
                    }}>
                    {/* customer name */}
                    <View style = { styles.formFieldWrapper }>
                        <TextView style = { styles.label }>
                            Name
                        </TextView>
                        <TextInput 
                            style = { styles.input }
                            value = { customer.name }
                            placeholder = "Name"
                            onChangeText = { this.handleInput.bind(this, "name" )}
                        />
                    </View>
                    {/* customer gender */}
                    <View style = { styles.formFieldWrapper }>
                        <TextView style = { styles.label }>
                            Gender
                        </TextView>
                        <View style = { styles.input }>
                            <Picker 
                                onValueChange={(value) => this.handleInput("gender", value)}
                                style = {{ flex: 1 }}
                                value = { customer.gender }>
                                <Picker.Item label="Select" value = { null } />
                                <Picker.Item label="Male" value="Male" />
                                <Picker.Item label="Female" value="Female" />
                                <Picker.Item label="Others" value="Others" />
                            </Picker>
                        </View>
                    </View>
                    {/* customer phone */}
                    <View style = { styles.formFieldWrapper }>
                        <TextView style = { styles.label }>
                            Phone
                        </TextView>
                        <View style = {{
                            flex: 1,
                            flexDirection: "row",
                            alignItems: "center"
                        }}>
                            <TextView style = {[styles.label, { marginRight: 12, marginTop: 6, fontWeight: "bold" }]}>
                                +91 
                            </TextView>
                            <TextInput 
                                style = { styles.input }
                                placeholder = "Phone"
                                value = { customer.phone }
                                keyboardType = {"phone-pad"}
                                onChangeText = { (value) => {
                                    const numReg = /^\d+$/;
                                    var isNum = numReg.test(value);
                                    if ((isNum || value.length === 0) && value.length <= 10) {
                                        this.handleInput("phone", value);
                                    } else {
                                        if (value.length === 10) {
                                            alert("Please enter valid phone number");
                                        } else {
                                            return;
                                        }
                                    }
                                }}
                            />  
                        </View>
                    </View>
                    {/* customer email */}
                    <View style = { styles.formFieldWrapper }>
                        <TextView style = { styles.label }>
                            Email
                        </TextView>
                        <TextInput 
                            style = { styles.input }
                            placeholder = "xyz@email.com"
                            value = { customer.email }
                            keyboardType = {"email-address"}
                            onChangeText = { this.handleInput.bind(this, "email") }
                        />
                    </View>
                    {/* customer address */}
                    <View style = { [styles.formFieldWrapper, { height: 150}] }>
                        <TextView style = { styles.label }>
                            Address
                        </TextView>
                        <TextInput 
                            style = { [styles.input, { height: 100, textAlignVertical: "top" }] }
                            placeholder = "Type address here"
                            multiline = {true}
                            numberOfLines = {4}
                            value = { customer.address }
                            onChangeText = { this.handleInput.bind(this, "address") }
                        />
                    </View>
                </ScrollView>
                <View style = { styles.footerButtonWrapper }>
                    <TouchableOpacity
                        onPress = { this.saveCustomer }
                        style = { styles.buttonStyle }>
                        <TextView style = { styles.buttonTextStyle }>
                            Save
                        </TextView>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        )
    }
}