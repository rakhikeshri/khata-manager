import React from "react";
import { connect } from "react-redux";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StatusBar,
    ScrollView,
    ActivityIndicator,
    Alert
} from "react-native";

import TextView from "core/TextView";

import {
    wToDP
} from "common/ResponsiveDimension";

import { checkIfLoggedIn } from "./../../../common/utils";

// style
import styles from "./styles";

// actions
import { registerAction, verifyOtpAction } from "./../../../actions/authActions";

@connect((store) => {
    return {
        user: store.auth.user,
        registerUser: store.auth.registerUser,
        phoneOtpVerfication: store.auth.phoneOtpVerfication,
        emailOtpVerfication: store.auth.emailOtpVerfication
    }
})
export default class Register extends React.Component {
    state = {
        stage: {
            "shopDetails": {
                shopName: "",
                shopPhone: "",
                gstin: "",
            },
            "shopAddress": {
                addressFirstLine: "",
                addressSecondLine: "",
                addressThirdLine: "",
                city: "",
                state: "",
                pincode: "",
            },
            "userDetails": {
                userFullName: "",
                userEmail: "",
                userPassword: "",
                userConfirmPassword: ""
            },
            "emailOtpVerification": {},
            "phoneOtpVerification": {}
        },
        steps: [
            "shopDetails",
            "shopAddress",
            "userDetails",
            "phoneOtpVerification",
            "emailOtpVerification",
            "success"
        ],
        fieldErrors: {},
        step: 0,
        focused: {},
        loader: false,
        phoneVerified: false,
        emailVerified: false,
        errorMessage: ""
    }

    componentDidUpdate = (prevProps) => {
        if (this.props.registerUser !== prevProps.registerUser) {
            if (this.props.registerUser.code === "EMAIL_EXIST") {
                Alert.alert(
                    "Email Already exists!",
                    "This email already exists in our database.",
                    [
                      { text: "OK"}
                    ]
                );
            } else {
                const { step } = this.state;
                this.setState({
                    step: step + 1
                })
            }
        }

        if (this.props.phoneOtpVerfication !== prevProps.phoneOtpVerfication) {
            if (this.props.phoneOtpVerfication.code === "SUCCESS") {
                this.setState({
                    loader: false,
                    phoneVerified: true
                })
            } else {
                this.setState({
                    errorMessage: "Could not verify phone, please re-enter the code",
                    loader: false,
                })
            }
        }

        if (this.props.emailOtpVerfication !== prevProps.emailOtpVerfication) {
            if (this.props.emailOtpVerfication.code === "SUCCESS") {
                this.setState({
                    loader: false,
                    emailVerified: true
                })
            } else {
                this.setState({
                    errorMessage: "Could not verify email, please re-enter the code",
                    loader: false,
                })
            }
        }
    }

    onRegister = () => {
        if (this.validateForm()) {
            const { stage } = this.state;
    
            const registrationPayload = {
                name: stage.userDetails.userFullName,
                email: stage.userDetails.userEmail,
                password: stage.userDetails.userPassword,
                phone: stage.shopDetails.shopPhone,
                shopName: stage.shopDetails.shopName,
                shopGSTIN: stage.shopDetails.gstin,
                shopAddressFirstLine: stage.shopAddress.addressFirstLine,
                shopAddressSecondLine: stage.shopAddress.addressSecondLine,
                shopAddressThirdLine: stage.shopAddress.addressThirdLine,
                shopCity: stage.shopAddress.city,
                shopState: stage.shopAddress.state,
                shopPincode: stage.shopAddress.pincode
            };

            this.props.dispatch(registerAction(registrationPayload));
        }
    };

    verifyOtp = (type) => {
        const { stage, steps, step } = this.state;
        const data = {
            email: stage.userDetails.userEmail,
            otp: null
        };

        data.otp = stage[steps[step]].otp;

        this.setState({
            loader: true
        }, () => {
            this.props.dispatch(verifyOtpAction(type, data))
        })
    }

    checkEmail(form) {
        const { fieldErrors } = this.state;
        if (form.hasOwnProperty("userEmail") && !this.validateEmail(form.userEmail)) {
            fieldErrors["userEmail"] = {type: "INVALID_EMAIL"};
            
            this.setState({
                fieldErrors
            });

            return false;
        }

        return true;
    }

    validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    handleInput = (type, value) => {
        const { stage, steps, step, fieldErrors } = this.state;

        if (type === "shopPhone") {
            value = value.replace(/[^0-9]/g, '');
        }

        if (type === "pincode") {
            value = value.replace(/[^0-9]/g, '');
        }

        delete fieldErrors[type];

        stage[steps[step]][type] = value;

        this.setState({
            stage
        })
    }

    handleFocus = (type) => {
        const { focused } = this.state;
        focused[type] = true;
        this.setState({ focused, errorMessage: "" });
    }

    handleBlur = (type) => {
        const { focused } = this.state;
        delete focused[type];
        this.setState({ focused });
    }

    getBorderColor(focused, fieldErrors, type) {
        if (focused[type]) {
            return "blue";
        } else if(fieldErrors[type]) {
            return "red";
        } else {
            return "#d6dade"
        }
    }

    formHandler = (currentStage) => {
        const { navigation } = this.props;
        let { 
            focused,
            stage,
            steps,
            step,
            fieldErrors,
            loader,
            phoneVerified,
            emailVerified,
            errorMessage
        } = this.state;
        switch(currentStage) {
            case "shopDetails": {
                return (
                    <View>
                        <View style={{padding:7}}>
                            <TextView>
                                Enter your shop details
                            </TextView>
                        </View>
                        <View style={{padding:7}}>
                            <TextInput
                                onChangeText = {this.handleInput.bind(this, "shopName")}
                                style = {[
                                    styles.input,
                                    {
                                        width: wToDP("85%"),
                                        borderColor: this.getBorderColor(focused, fieldErrors, "shopName")
                                    }
                                ]}
                                placeholder={'Shop Name'}
                                value = {stage[steps[step]]["shopName"]}
                                underlineColorAndroid='transparent'  
                                onFocus={() => this.handleFocus('shopName')}
                                onBlur={() => this.handleBlur('shopName')}
                                ></TextInput>
                        </View>
                        <View style={{padding:7}}>
                            <TextInput
                                onChangeText = {this.handleInput.bind(this, "shopPhone")}
                                style = {[
                                    styles.input,
                                    {
                                        width: wToDP("85%"),
                                        borderColor: this.getBorderColor(focused, fieldErrors, "shopPhone")
                                    }
                                ]}
                                keyboardType="phone-pad"
                                maxLength={10}
                                placeholder={'Phone'}
                                value = {stage[steps[step]]["shopPhone"]}
                                underlineColorAndroid='transparent'  
                                onFocus={() => this.handleFocus('shopPhone')}
                                onBlur={() => this.handleBlur('shopPhone')}
                                ></TextInput>
                        </View>
                        <View style={{padding:7}}>
                            <TextInput
                                onChangeText = {this.handleInput.bind(this, "gstin")}
                                style = {[
                                    styles.input,
                                    {
                                        width: wToDP("85%"),
                                        borderColor: this.getBorderColor(focused, fieldErrors, "gstin")
                                    }
                                ]}
                                placeholder={'GSTIN'}
                                value = {stage[steps[step]]["gstin"]}
                                underlineColorAndroid='transparent'  
                                onFocus={() => this.handleFocus('gstin')}
                                onBlur={() => this.handleBlur('gstin')}
                                ></TextInput>
                        </View>
                    </View>
                );
            }

            case "shopAddress": {
                return (
                    <View>
                        <View style={{padding:7}}>
                            <TextView>
                                Enter your shop address
                            </TextView>
                        </View>
                        <View style={{padding:7}}>
                            <TextInput
                                onChangeText = {this.handleInput.bind(this, "addressFirstLine")}
                                style = {[
                                    styles.input,
                                    {
                                        width: wToDP("85%"),
                                        borderColor: this.getBorderColor(focused, fieldErrors, "addressFirstLine")
                                    }
                                ]}
                                placeholder={'Address First Line'}
                                underlineColorAndroid='transparent'
                                value = {stage[steps[step]]["addressFirstLine"]}
                                onFocus={() => this.handleFocus('addressFirstLine')}
                                onBlur={() => this.handleBlur('addressFirstLine')}
                                ></TextInput>
                        </View>
                        <View style={{padding:7}}>
                            <TextInput
                                onChangeText = {this.handleInput.bind(this, "addressSecondLine")}
                                style = {[
                                    styles.input,
                                    {
                                        width: wToDP("85%"),
                                        borderColor: this.getBorderColor(focused, fieldErrors, "addressSecondLine")
                                    }
                                ]}
                                placeholder={'Address Second Line'}
                                underlineColorAndroid='transparent'
                                value = {stage[steps[step]]["addressSecondLine"]}
                                onFocus={() => this.handleFocus('addressSecondLine')}
                                onBlur={() => this.handleBlur('addressSecondLine')}
                                ></TextInput>
                        </View>
                        <View style={{padding:7}}>
                            <TextInput
                                onChangeText = {this.handleInput.bind(this, "addressThirdLine")}
                                style = {[
                                    styles.input,
                                    {
                                        width: wToDP("85%"),
                                        borderColor: this.getBorderColor(focused, fieldErrors, "addressThirdLine")
                                    }
                                ]}
                                placeholder={'Address Third Line'}
                                underlineColorAndroid='transparent'
                                value = {stage[steps[step]]["addressThirdLine"]}
                                onFocus={() => this.handleFocus('addressThirdLine')}
                                onBlur={() => this.handleBlur('addressThirdLine')}
                                ></TextInput>
                        </View>
                        <View style={{padding:7}}>
                            <TextInput
                                onChangeText = {this.handleInput.bind(this, "city")}
                                style = {[
                                    styles.input,
                                    {
                                        width: wToDP("85%"),
                                        borderColor: this.getBorderColor(focused, fieldErrors, "city")
                                    }
                                ]}
                                placeholder={'City'}
                                underlineColorAndroid='transparent'
                                value = {stage[steps[step]]["city"]}
                                onFocus={() => this.handleFocus('city')}
                                onBlur={() => this.handleBlur('city')}
                                ></TextInput>
                        </View>
                        <View style={{padding:7}}>
                            <TextInput
                                onChangeText = {this.handleInput.bind(this, "state")}
                                style = {[
                                    styles.input,
                                    {
                                        width: wToDP("85%"),
                                        borderColor: this.getBorderColor(focused, fieldErrors, "state")
                                    }
                                ]}
                                placeholder={'State'}
                                underlineColorAndroid='transparent'
                                value = {stage[steps[step]]["state"]}
                                onFocus={() => this.handleFocus('state')}
                                onBlur={() => this.handleBlur('state')}
                                ></TextInput>
                        </View>
                        <View style={{padding:7}}>
                            <TextInput
                                onChangeText = {this.handleInput.bind(this, "pincode")}
                                style = {[
                                    styles.input,
                                    {
                                        width: wToDP("85%"),
                                        borderColor: this.getBorderColor(focused, fieldErrors, "pincode")
                                    }
                                ]}
                                keyboardType="number-pad"
                                maxLength={6}
                                placeholder={'Pincode'}
                                underlineColorAndroid='transparent'
                                value = {stage[steps[step]]["pincode"]}
                                onFocus={() => this.handleFocus('pincode')}
                                onBlur={() => this.handleBlur('pincode')}
                                ></TextInput>
                        </View>
                    </View>
                )
            }

            case "userDetails": {
                return (
                    <View>
                        <View style={{padding:7}}>
                            <TextView>
                                Enter user details
                            </TextView>
                        </View>
                        <View style={{padding:7}}>
                            <TextInput
                                onChangeText = {this.handleInput.bind(this, "userFullName")}
                                style = {[
                                    styles.input,
                                    {
                                        width: wToDP("85%"),
                                        borderColor: this.getBorderColor(focused, fieldErrors, "userFullName")
                                    }
                                ]}
                                placeholder={'Full Name'}
                                underlineColorAndroid='transparent'
                                value = {stage[steps[step]]["userFullName"]}
                                onFocus={() => this.handleFocus('userFullName')}
                                onBlur={() => this.handleBlur('userFullName')}
                                ></TextInput>
                        </View>
                        <View style={{padding:7}}>
                            <TextInput
                                onChangeText = {this.handleInput.bind(this, "userEmail")}
                                style = {[
                                    styles.input,
                                    {
                                        width: wToDP("85%"),
                                        borderColor: this.getBorderColor(focused, fieldErrors, "userEmail")
                                    }
                                ]}
                                placeholder={'Email'}
                                underlineColorAndroid='transparent'
                                value = {stage[steps[step]]["userEmail"]}
                                onFocus={() => this.handleFocus('userEmail')}
                                onBlur={() => this.handleBlur('userEmail')}
                                ></TextInput>
                        </View>
                        <View style={{padding:7}}>
                            <TextInput
                                onChangeText = {this.handleInput.bind(this, "userPassword")}
                                style = {[
                                    styles.input,
                                    {
                                        width: wToDP("85%"),
                                        borderColor: this.getBorderColor(focused, fieldErrors, "userPassword")
                                    }
                                ]}
                                placeholder={'Password'}
                                secureTextEntry={true}
                                underlineColorAndroid='transparent'
                                value = {stage[steps[step]]["userPassword"]}
                                onFocus={() => this.handleFocus('userPassword')}
                                onBlur={() => this.handleBlur('userPassword')}
                                ></TextInput>
                        </View>
                        <View style={{padding:7}}>
                            <TextInput
                                onChangeText = {this.handleInput.bind(this, "userConfirmPassword")}
                                style = {[
                                    styles.input,
                                    {
                                        width: wToDP("85%"),
                                        borderColor: this.getBorderColor(focused, fieldErrors, "userConfirmPassword")
                                    }
                                ]}
                                placeholder={'Confirm Password'}
                                secureTextEntry={true}
                                underlineColorAndroid='transparent'
                                value = {stage[steps[step]]["userConfirmPassword"]}
                                onFocus={() => this.handleFocus('userConfirmPassword')}
                                onBlur={() => this.handleBlur('userConfirmPassword')}
                                ></TextInput>
                        </View>

                        <View style = {{ paddingLeft: 10, marginTop: 10 }}>
                            <TextView style = {{ color: "red" }}>
                                *Password should be greater than 8 characters.
                            </TextView>
                        </View>

                        <TouchableOpacity
                            onPress = {this.onRegister}
                            style = {[styles.loginButton, { alignSelf: "center", borderRadius: 28, width: 140, marginTop: 70 }]}>
                            <TextView style = {styles.loginButtonText}>
                                Submit
                            </TextView>
                        </TouchableOpacity>
                    </View>
                )
            }

            case "phoneOtpVerification": {
                return (
                    <View>
                        <View style={{padding:7}}>
                            <TextView>
                                {
                                    !phoneVerified ? "Enter otp received on your phone" : "Phone successfully verified."
                                }
                            </TextView>
                        </View>
                        {
                            !phoneVerified ? (
                                <View style={{padding:7}}>
                                    <TextInput
                                        onChangeText = {this.handleInput.bind(this, "otp")}
                                        keyboardType="number-pad"
                                        style = {[styles.input,{width: wToDP("85%"), borderColor: focused["Otp"] ? 'blue' : '#d6dade'}]}
                                        placeholder={'Otp'}
                                        underlineColorAndroid='transparent'  
                                        onFocus={() => this.handleFocus('Otp')}
                                        onBlur={() => this.handleBlur('Otp')}
                                        ></TextInput>

                                    <TouchableOpacity
                                        onPress = {this.verifyOtp.bind(this, "phone")}
                                        style = {[styles.loginButton, { flexDirection: "row", alignSelf: "center", borderRadius: 28, width: 140, marginTop: 70 }]}>
                                        <TextView style = {styles.loginButtonText}>
                                            Verify
                                        </TextView>
                                        {
                                            loader ? (
                                                <View style = {{ marginLeft: 10}}>
                                                    <ActivityIndicator size='small' animating={true} color="#fff"/>
                                                </View>
                                            ) : null
                                        }
                                    </TouchableOpacity>
                                    {
                                        errorMessage.length !== 0 ? (
                                            <View style = {{ marginTop: 20 }}>
                                                <TextView style = {{ color: "red" }}>
                                                    { errorMessage }
                                                </TextView>
                                            </View>
                                        ): null
                                    }
                                </View>
                            ) : null
                        }
                    </View>
                );
            }

            case "emailOtpVerification" : {
                return (
                    <View>
                        <View style={{padding:7}}>
                            <TextView>
                            {
                                !emailVerified ? "Enter otp received on your email" : "Email successfully verified."
                            }
                            </TextView>
                        </View>
                        {
                            !emailVerified ? (
                                <View style={{padding:7}}>
                                    <TextInput
                                        onChangeText = {this.handleInput.bind(this, "otp")}
                                        keyboardType="number-pad"
                                        style = {[styles.input,{width: wToDP("85%"), borderColor: focused["Email Otp"] ? 'blue' : '#d6dade'}]}
                                        placeholder={'Otp'}
                                        underlineColorAndroid='transparent'  
                                        onFocus={() => this.handleFocus('Email Otp')}
                                        onBlur={() => this.handleBlur('Email Otp')}
                                        ></TextInput>

                                    <TouchableOpacity
                                        onPress = {this.verifyOtp.bind(this, "email")}
                                        style = {[styles.loginButton, { flexDirection: "row", alignSelf: "center", borderRadius: 28, width: 140, marginTop: 70 }]}>
                                        <TextView style = {styles.loginButtonText}>
                                            Verify
                                        </TextView>
                                        {
                                            loader ? (
                                                <View style = {{ marginLeft: 10}}>
                                                    <ActivityIndicator size='small' animating={true} color="#fff"/>
                                                </View>
                                            ) : null
                                        }
                                    </TouchableOpacity>

                                    {
                                        errorMessage.length !== 0 ? (
                                            <View style = {{ marginTop: 20 }}>
                                                <TextView style = {{ color: "red" }}>
                                                    { errorMessage }
                                                </TextView>
                                            </View>
                                        ): null
                                    }
                                </View>
                            ): null
                        }
                    </View>
                )
            }

            case "success": {
                return (
                    <View>
                        <View style={{padding:7}}>
                            <TextView>
                                Success
                            </TextView>
                            <TextView>
                                Your shop is now registered on Khatamanager.
                            </TextView>
                        </View>
                        <View style={{padding:7}}>
                            <TouchableOpacity
                                onPress = {() => {
                                    navigation.navigate("Login")
                                }}
                                style = {[styles.loginButton, { alignSelf: "center", borderRadius: 28, width: 140, marginTop: 70 }]}>
                                <TextView style = {styles.loginButtonText}>
                                    Login
                                </TextView>
                            </TouchableOpacity>
                        </View>
                    </View>
                )
            }
        }
    }

    validateForm = () => {
        const { stage, steps, step } = this.state;

        const form = stage[steps[step]];

        if (!this.hasNoEmptyField(form)) return false;
        else if (!this.checkPhone(form)) return false;
        else if (!this.checkEmail(form)) return false;
        else if (!this.checkPassword(form)) return false;

        else return true;
    }

    checkPassword(form) {
        const { fieldErrors } = this.state;
        if (form.hasOwnProperty("userPassword") && form.hasOwnProperty("userConfirmPassword") && 
            form.userPassword.length < 8) {

            fieldErrors["userPassword"] = {type: "PASSWORD_LENGTH_ERROR"};
            
            this.setState({
                fieldErrors
            });

            return false;
        } else if (form.hasOwnProperty("userPassword") && form.hasOwnProperty("userConfirmPassword") && 
            form.userPassword !== form.userConfirmPassword) {

            fieldErrors["userPassword"] = {type: "PASSWORD_DOESNOT_MATCH"};
            fieldErrors["userConfirmPassword"] = {type: "PASSWORD_DOESNOT_MATCH"};
        
            this.setState({
                fieldErrors
            });

            return false;
        }

        return true;
    }

    checkPhone(form) {
        const { fieldErrors } = this.state;
        if (form.hasOwnProperty("shopPhone") && form.shopPhone.length < 10) {
            fieldErrors["shopPhone"] = {type: "INVALID_PHONE_NUMBER"};
            
            this.setState({
                fieldErrors
            });
            return false;
        }

        return true;
    }

    hasNoEmptyField(form) {
        const { fieldErrors } = this.state;
        let notEmpty = true;
        const keys = Object.keys(form)
        for (let i = 0; i < keys.length; i++) {
            if(form[keys[i]].length === 0) {
                notEmpty = false;
                fieldErrors[keys[i]] = {type: "FIELD_EMPTY"};
            }
        }

        this.setState({ fieldErrors })
        return notEmpty
    }

    navigate = (type) => {
        const { step } = this.state;
        if (type === "next" && this.validateForm()) {
            this.setState({
                step: step + 1
            })
        } else if (type === "previous") {
            this.setState({
                step: step - 1
            })
        }
    }
    
    render() {
        let {
            steps,
            step,
            phoneVerified,
            emailVerified,
            fieldErrors
        } = this.state;
        return (
            <ScrollView contentContainerStyle={{flex: 1}} keyboardShouldPersistTaps='always'>
                <StatusBar hidden />
                <View style = {styles.container}>
                    <View style={{ marginTop: 70, alignItems:'center', justifyContent:'center'}}>
                        <Image source={require('../../../../assets/images/logo.png')} style={{height:50, resizeMode:'contain'}}/>
                    </View>
                    <View style = {styles.wrapper}>
                        {
                            this.formHandler(steps[step])
                        }
                    </View>
                    <View style={{flex: 2, padding:7, flexDirection: "row", width: "90%"}}>
                        {
                            step !== 0 && step < 2 ? (
                                <TouchableOpacity
                                    onPress = {this.navigate.bind(this, "previous")}
                                    style = {[styles.loginButton, { alignSelf: "flex-start"}]}>
                                    <TextView style = {styles.loginButtonText}>
                                        Previous
                                    </TextView>
                                </TouchableOpacity>
                            ) : null
                        }
                        <View style = {{ flex: 1 }}>

                        </View>
                        {
                            (step >= 0 && step < 2) || ((phoneVerified || emailVerified) && step !== steps.length - 1) ? (
                                <TouchableOpacity
                                    // disabled = {true}
                                    onPress = {this.navigate.bind(this, "next")}
                                    style = {[styles.loginButton]}>
                                    <TextView style = {styles.loginButtonText}>
                                        Next
                                    </TextView>
                                </TouchableOpacity>
                            ) : null
                        }
                    </View>
                </View>
            </ScrollView>
        )
    }
}
