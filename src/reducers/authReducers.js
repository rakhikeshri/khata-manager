export default function reducer(state = {
    user: "",
    registerUser: null,
    phoneOtpVerfication: null,
    emailOtpVerfication: null
}, action) {
    switch(action.type) {
        case "LOGIN_USER" : {
            return { ...state, user: action.payload}
        }

        case "LOGOUT_USER": {
            return { ...state, user: {} }
        }

        case "REGISTER_USER": {
            return { ...state, registerUser: action.payload }
        }

        case "VERIFY_OTP_PHONE": {
            return { ...state, phoneOtpVerfication: action.payload}
        }

        case "VERIFY_OTP_EMAIL": {
            return { ...state, emailOtpVerfication: action.payload}
        }
    }

    return state;
}