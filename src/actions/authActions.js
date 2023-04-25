import xttp from "./../common/network";
import { getConfig } from "./../common/AppConfig";
import { resetStackNavigationTo, saveToLocal, removeFromLocal,  errorMessage} from "./../common/utils";

export function loginAction(navigation, login = true, loginPayload) {
    return async function(dispatch) {
        let user = {};
        let code = 500;
        // if login
        if(login) {
            const input = {
                method: "post",
                url: getConfig("api").host+getConfig("api").root+"/auth/login",
                data: loginPayload
            }

            console.log(input);

            const response = await xttp(input)
            .then((response) => {
                user = response.data;
                // persist data in localStorage
                if(user.code === 'LOGIN_FAILURE'){
                    user = loginPayload;
                    code = 401;
                }else {
                    saveToLocal("ph_user_data", JSON.stringify(user))
                    code = 200;
                }
            })
        } else {
            user = loginPayload;
            code = 200;
        }

        if(code === 200) {
            dispatch({
                type : "LOGIN_USER",
                payload: user
            })

            console.log(user, navigation);

            // reset and navigate to dashboard
            resetStackNavigationTo(navigation, { name: 'Dashboard' });
        }

        if(code === 401 && login){
            errorMessage('Login Failed', 'Please confirm your Username/Password', 'Ok', 'Cancel')
        }
    }
}

export function logoutAction(navigation, email) {
    return async function(dispatch) {
        let user = {};
        let code = 500;
        const input = {
            method: "put",
            url: getConfig("api").host+getConfig("api").root+"/auth/logout",
            data: {
                _id: email
            }
        }

        const response = await xttp(input)
        .then((response) => {
            if(response.code === 200){
                code = 200
                removeFromLocal("ph_user_data")
    
                // reset and navigate to dashboard
                resetStackNavigationTo(navigation, { name: 'Login' });
            }
        })
        if(code === 200){
            dispatch({
                type : "LOGOUT_USER",
                payload: response.data
            })
        }
    }
}

export function registerAction(data) {
    return async function(dispatch) {
        const input = {
            method: "POST",
            url: getConfig("api").host+getConfig("api").root+"/auth/register",
            data
        }

        const response = await xttp(input);

        if(response.code === 200){
            dispatch({
                type : "REGISTER_USER",
                payload: response.data
            })
        }
    }
}

export function verifyOtpAction(type, data) {
    return async function(dispatch) {
        const input = {
            method: "PUT",
            url: getConfig("api").host+getConfig("api").root+"/auth/verify/"+type,
            data
        }

        const response = await xttp(input);

        if(response.code === 200){
            dispatch({
                type : "VERIFY_OTP_"+(type.toUpperCase()),
                payload: response.data
            })
        }
    }
}