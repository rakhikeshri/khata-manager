import xttp from "./../common/network";
import { getConfig } from "./../common/AppConfig";

export function getOrderList(token, pageInfo = {}, opt = "PUSH") {
    return async function(dispatch) {
        const { page, limit } = pageInfo;
        
        let url = getConfig("api").host+getConfig("api").root+"/orders/";

        if (page && limit) {
            url += page+"/"+limit;
        }

        const input = {
            method: "get",
            url: url,
            headers: {
                "ph-access-token": token
            }
        }
        
        const response = await xttp(input);

        if(response.code !== 200) {
            alert(response.code+", "+response.error); 
        }

        dispatch({
            type : "ORDER_LIST",
            payload: response.data,
            moreOrder: response.data.length < limit ? false : true,     // if more data available
            operation: page && limit ? opt : "REPLACE"
        });
    }
}

export function searchOrderList(searchText, token) {
    return async function(dispatch) {
        const input = {
            method: "get",
            url: getConfig("api").host+getConfig("api").root+"/orders/?q="+searchText,
            headers: {
                "ph-access-token": token
            }
        }
        
        const response = await xttp(input);
    
        if(response.code !== 200) {
            alert(response.code+", "+response.error); 
        }

        dispatch({
            type : "ORDER_LIST",
            payload: response.data
        });
    }
}

export function scanProduct(productId, token) {
    return async function(dispatch) {
        const input = {
            method: "get",
            url: getConfig("api").host+getConfig("api").root+"/orders/items/scan/"+productId,
            headers: {
                "ph-access-token": token
            }
        }
        
        const response = await xttp(input);

        if(response.code !== 200) {
            alert(response.code+", "+response.error); 
        }

        dispatch({
            type : "SCAN_PRODUCT",
            payload: response.data
        });
    }
}

export function addProductToBill(data) {
    return function(dispatch) {
        dispatch({
            type: "CREATE_BILL_PAYLOAD",
            payload: data
        })
    }
}

export function getCustomerDetails(phone, token) {
    return async function(dispatch) {
        const input = {
            method: "get",
            url: getConfig("api").host+getConfig("api").root+"/orders/customers/fetch/"+phone,
            headers: {
                "ph-access-token": token
            }
        }
        
        const response = await xttp(input);

        if(response.code !== 200) {
            alert(JSON.stringify(response));
        }

        dispatch({
            type: "GET_CUSTOMER_DETAILS",
            payload: response.data
        })
    }
}

export function saveCustomer(customerPayload, token) {
    return async function(dispatch) {
        const input = {
            method: "post",
            url: getConfig("api").host+getConfig("api").root+"/orders/customers/create",
            headers: {
                "ph-access-token": token
            },
            data: customerPayload
        }
  
        const response = await xttp(input);

        if(response.code !== 200) {
            alert(JSON.stringify(response));
        }

        dispatch({
            type: "SAVE_CUSTOMER_DETAILS",
            payload: response.data
        })
    }
}

export function createOrder(orderPayload, token) {
    return async function(dispatch) {
        const input = {
            method: "post",
            url: getConfig("api").host+getConfig("api").root+"/orders",
            headers: {
                "ph-access-token": token
            },
            data: orderPayload
        }

        const response = await xttp(input);
        console.log(response.code === 403 && response.data.code === "NOT_SUBSCRIBED")
        if (response.code === 403 && response.data.code === "NOT_SUBSCRIBED") { 
            // show subsciprtion expired popup
            dispatch({
                type : "SUBSCRIPTION_EXPIRED_POPUP",
                payload: true
            });

            return;
        }

        if(response.code !== 200) {
            alert(JSON.stringify(response));
        }

        dispatch({
            type: "CREATE_ORDER",
            payload: response.data
        })
    }
}

export function settlePayment(token, orderId, payload) {
    return async function(dispatch) {
        const input = {
            method: "put",
            url: getConfig("api").host+getConfig("api").root+"/orders/settle/"+orderId,
            headers: {
                "ph-access-token": token
            },
            data: payload
        }
        
        const response = await xttp(input);

        if(response.code !== 200) {
            alert(JSON.stringify(response));
        }

        dispatch({
            type: "SETTLE_PAYMENT",
            payload: response.data
        })
    }
}

export function sendMessage(orderID, token) {
    return async function(dispatch) {
        const input = {
            method: "GET",
            url: getConfig("api").host+getConfig("api").root+'/orders/send/invoice/'+orderID,
            headers: {
                "ph-access-token": token
            },
        }

        const response = await xttp(input);
        if(response.code !== 200) {
            alert(JSON.stringify(response));
        }

        if(response.code === 200) {
            alert('Message Sent to Customer');
        }

        dispatch({
            type: "SEND_MESSAGE",
            payload: response.data
        })
    }
}

export function updateOrderList(orderList) {
    return function(dispatch) {
        dispatch({
            type: "LOCAL_UPDATE_ORDER_LIST",
            payload: orderList
        })
    }
}

export function resetCreateOrder() {
    return function(dispatch) {
        dispatch({
            type : "RESET_ORDER"
        })
    }
}

export function deleteOrder(orderID, token) {
    return async function(dispatch) {
        const input = {
            method: "DELETE",
            url: getConfig("api").host+getConfig("api").root+'/orders',
            headers: {
                "ph-access-token": token
            },
            data: {
                _id: orderID
            }
        }

        const response = await xttp(input);
        if(response.code !== 200) {
            alert(JSON.stringify(response));
        }

        dispatch({
            type: "DELETE_ORDER",
            payload: response.data
        })
    }
}

export function requestSettlement(customerId, phone, token) {
    return async function(dispatch) {
        const input = {
            method: "GET",
            url: getConfig("api").host+getConfig("api").root+'/orders/settlement/settlementRequest/'+"?customerId="+customerId+"&phone="+phone,
            headers: {
                "ph-access-token": token
            },
        }
        
        
        const response = await xttp(input);
        if(response.code !== 200) {
            alert(JSON.stringify(response));
        }

        dispatch({
            type: "REQUEST_SETTLEMENT",
            payload: response.data
        })
    }
}