export default function reducer(state = {
    subscriptionExpiredPopup: false
}, action) {
    switch(action.type) {
        case "SUBSCRIPTION_EXPIRED_POPUP":{
            return {...state, subscriptionExpiredPopup: action.payload}
        }
    }

    return state;
}