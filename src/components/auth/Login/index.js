import React from "react";
import { connect } from "react-redux";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StatusBar
} from "react-native";

import TextView from "core/TextView";

import {
    wToDP
} from "common/ResponsiveDimension";

import { checkIfLoggedIn } from "./../../../common/utils";

// style
import styles from "./styles";

// actions
import { loginAction } from "./../../../actions/authActions";

@connect((store) => {
    return {
        user: store.auth.user
    }
})
export default class Login extends React.Component {
    state = {
        loginForm: {
            username: "",
            password: "",
            type: "email"
        },
        isFocusedUsername:false,
        isFocusedPassword:false,
    }

    async componentDidMount() {
        const { navigation, dispatch } = this.props;
        await checkIfLoggedIn(dispatch, navigation)
    }

    redirectToRegister = () => {
        const { navigation } = this.props;
        navigation.navigate("Register");
    }

    onLogin = () => {
        const { navigation } = this.props;
        const { loginForm } = this.state;

        try {
            const newLoginForm = this.parseLoginForm(loginForm);
            this.props.dispatch(loginAction(navigation, true, newLoginForm));
        } catch (e) {
            alert(e);
        }
    };

    parseLoginForm = (loginForm) => {
        loginForm.username = loginForm.username.trim();
        loginForm.username = loginForm.username.toLowerCase();
        if (!this.checkEmail(loginForm.username)) {
            throw "Invalid Email!"
        }

        return {
            ...loginForm
        };
    }

    checkEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    handleInput = (type, value) => {
        const { loginForm } = this.state;

        loginForm[type] = value;

        this.setState({
            loginForm
        })
    }

    handleFocus = (type) => {
        this.setState({[type] : true})
    }

    handleBlur = (type) => {
        this.setState({[type] : false})
    }
    
    render() {
        let { isFocusedUsername, isFocusedPassword } = this.state;
        return (
            <View style = {styles.container}>
                <StatusBar hidden />
                <View style={{flex:2, alignItems:'center', justifyContent:'center'}}>
                    <Image source={require('../../../../assets/images/logo.png')} style={{height:50, resizeMode:'contain'}}/>
                </View>
                <View style = {styles.wrapper}>
                    <View style={{padding:7}}>
                        <TextInput
                            onChangeText = {this.handleInput.bind(this, "username")}
                            style = {[styles.input,{width: wToDP("85%"), borderColor: isFocusedUsername ? 'blue' : '#d6dade'}]}
                            placeholder={'Username'}
                            underlineColorAndroid='transparent'  
                            onFocus={() => this.handleFocus('isFocusedUsername')}
                            onBlur={() => this.handleBlur('isFocusedUsername')}
                            ></TextInput>
                    </View>
                    <View style={{padding:7}}>
                        <TextInput
                            onChangeText = {this.handleInput.bind(this, "password")}
                            style = {[styles.input,{width: wToDP("85%"), borderColor: isFocusedPassword ? 'blue' : '#d6dade'}]}
                            placeholder={'Password'}
                            secureTextEntry={true}
                            underlineColorAndroid='transparent'  
                            onFocus={() => this.handleFocus('isFocusedPassword')}
                            onBlur={() => this.handleBlur('isFocusedPassword')}
                            ></TextInput>
                    </View>
                    <View style={{padding:7}}>
                        <TouchableOpacity
                            onPress = {this.onLogin}
                            style = {[styles.loginButton, { width: wToDP("85%") }]}>
                            <TextView style = {styles.loginButtonText}>
                                Login
                            </TextView>
                        </TouchableOpacity>
                    </View>

                </View>
                <View style={{padding:7, flex: 1}}>
                    <TouchableOpacity
                        onPress = {this.redirectToRegister}
                        style = {[styles.registerLink, { width: wToDP("85%") }]}>
                        <TextView style = {[styles.loginButtonText, { color: "#1abc9c", width: 140}]}>
                            Create Account
                        </TextView>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}
