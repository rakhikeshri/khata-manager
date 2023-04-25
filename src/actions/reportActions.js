import xttp from "./../common/network";
import { getConfig } from "./../common/AppConfig";

export function getDashboardInitiallyReport(token, min) {
    return async function(dispatch) {
        const input = {
            method: "get",
            url: getConfig("api").host+getConfig("api").root+`/reports/dashboard/?min=`+min,
            headers: {
                "ph-access-token": token
            }
        }
        
        const response = await xttp(input);
        if(response.code !== 200) {
            alert(response.code+", "+response.error); 
        }

        dispatch({
            type : "DASHBOARD_REPORT_INITIALLY_LIST",
            payload: response.data
        });
    }
}

export function getDashboardReport(token, min, max) {
    return async function(dispatch) {
        const input = {
            method: "get",
            url: getConfig("api").host+getConfig("api").root+`/reports/dashboard?min=${min}&max=${max}`,
            headers: {
                "ph-access-token": token
            }
        }
        const response = await xttp(input);
        if(response.code !== 200) {
            alert(response.code+", "+response.error); 
        }

        dispatch({
            type : "DASHBOARD_REPORT_LIST",
            payload: response.data
        });
    }
}

export function getUnsettledCustomers(token) {
    return async function(dispatch) {
        const input = {
            method: "get",
            url: getConfig("api").host+getConfig("api").root+`/orders/settlement/customers`,
            headers: {
                "ph-access-token": token
            }
        }
        const response = await xttp(input);
        if(response.code !== 200) {
            alert(response.code+", "+response.error); 
        }

        dispatch({
            type : "UNSETTLED_CUSTOMER_LIST",
            payload: response.data
        });
    }
}

export function getOutOFStockProduct(token) {
    return async function(dispatch) {
        const input = {
            method: "get",
            url: getConfig("api").host+getConfig("api").root+"/reports/outofstock/",
            headers: {
                "ph-access-token": token
            }
        }
        const response = await xttp(input);

        if(response.code !== 200) {
            alert(response.code+", "+response.error); 
        }

        dispatch({
            type : "OUT_OF_STOCK_LIST",
            payload: response.data
        });
    }
}

export function getExpiredProduct(token) {
    return async function(dispatch) {
        const input = {
            method: "get",
            url: getConfig("api").host+getConfig("api").root+"/reports/expiring/",
            headers: {
                "ph-access-token": token
            }
        }
        const response = await xttp(input);
        if(response.code !== 200) {
            alert(response.code+", "+response.error); 
        }

        dispatch({
            type : "EXPIRED_PRODUCT_LIST",
            payload: response.data
        });
    }
}

export function downloadOutOfStockProduct(token) {
    return async function(dispatch) {
        const input = {
            method: "get",
            url: getConfig("api").host+getConfig("api").root+"/reports/outofstock/export",
            headers: {
                "ph-access-token": token,
                "Content-Type": "application/octet-stream"
            }
        }
        const response = await xttp(input);

        return response;
    }
}

