import xttp from "./../common/network";
import { getConfig } from "./../common/AppConfig";

export function showSubscriptionExpiredPopup() {
    return async function(dispatch) {
        dispatch({
            type : "SUBSCRIPTION_EXPIRED_POPUP",
            payload: true
        });
    }
}

export function hideSubscriptionExpiredPopup() {
    return async function(dispatch) {
        dispatch({
            type : "SUBSCRIPTION_EXPIRED_POPUP",
            payload: false
        });
    }
}