import xttp from "./../common/network";
import { getConfig } from "./../common/AppConfig";
import { resetStackNavigationTo, saveToLocal, removeFromLocal } from "./../common/utils";

export function getCustomerList(token) {
    return async function(dispatch) {
        const input = {
            method: "get",
            url: getConfig("api").host+getConfig("api").root+"/customers",
            headers: {
                "ph-access-token": token
            }
        }
        
        const response = await xttp(input);

        if(response.code !== 200) {
            alert(response.code+", "+response.error); 
        }

        dispatch({
            type : "CUSTOMER_LIST",
            payload: response.data
        });
    }
}

export function searchCustomerList(searchText, token) {
    return async function(dispatch) {
        const input = {
            method: "get",
            url: getConfig("api").host+getConfig("api").root+"/customers/?q="+searchText,
            headers: {
                "ph-access-token": token
            }
        }
        
        const response = await xttp(input);

        if(response.code !== 200) {
            alert(response.code+", "+response.error); 
        }

        dispatch({
            type : "CUSTOMER_LIST",
            payload: response.data
        });
    }
}

export function saveCustomer(token, customer) {
    return async function(dispatch) {
        const input = {
            method: "post",
            url: getConfig("api").host+getConfig("api").root+"/customers/",
            headers: {
                "ph-access-token": token
            },
            data: customer
        }
        
        const response = await xttp(input);

        if(response.code !== 200) {
            alert(response.code+", "+response.error); 
        }

        dispatch({
            type : "SAVE_CUSTOMER",
            payload: response.data
        });
    }
}