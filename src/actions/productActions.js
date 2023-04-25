import xttp from "./../common/network";
import { getConfig } from "./../common/AppConfig";
import { toQueryString } from "common/utils";

export function getProductList(token, pageInfo = {}, opt = "PUSH", filter = {}, q = null) {
    return async function (dispatch) {
        const { page, limit } = pageInfo;
        
        let url = getConfig("api").host + getConfig("api").root + "/products/paginate/";
        const queryString = toQueryString(filter);

        
        if (page && limit) {
            url += page+"/"+limit;
        }
        
        if (queryString.length !== 0) {
            url += "?"+queryString;
        }
        
        if (q) {
            url = url + "?q=" + q;
        }

        const input = {
            method: "get",
            url,
            headers: {
                "ph-access-token": token
            }
        }

        const response = await xttp(input);
        if (response.code !== 200) {
            alert(response.code + ", " + response.error);
        }

        dispatch({
            type: "PRODUCT_LIST",
            payload: response.data,
            operation: page && limit ? opt : "REPLACE"
        });
    }
}

export function getStockList(token, q = null) {
    return async function (dispatch) {
        let url = getConfig("api").host + getConfig("api").root + "/products/";

        if (q) {
            url = url + "?q=" + q;
        }

        const input = {
            method: "get",
            url,
            headers: {
                "ph-access-token": token
            }
        }

        const response = await xttp(input);
        if (response.code !== 200) {
            alert(response.code + ", " + response.error);
        }

        dispatch({
            type: "PRODUCT_STOCK_LIST",
            payload: response.data
        });
    }
}

export function createProduct(token, product) {
    return async function (dispatch) {
        const input = {
            method: "post",
            url: getConfig("api").host + getConfig("api").root + "/products/",
            headers: {
                "ph-access-token": token
            },
            data: product
        }

        const response = await xttp(input);
        if (response.code !== 200) {
            alert(response.code + ", " + response.error);
        }

        dispatch({
            type: "CREATE_PRODUCT",
            payload: response.data
        });
    }
}

export function updateProduct(token, pid, updatedFields) {
    return async function (dispatch) {
        const input = {
            method: "put",
            url: getConfig("api").host + getConfig("api").root + "/products/",
            headers: {
                "ph-access-token": token
            },
            data: {
                where: {
                    pid
                },
                data: updatedFields
            }
        }

        const response = await xttp(input);
        if (response.code !== 200) {
            alert(response.code + ", " + response.error);
        }

        dispatch({
            type: "UPDATE_PRODUCT",
            payload: response.data
        });
    }
}

export function updateStock(token, stockData) {
    return async function (dispatch) {
        const input = {
            method: "put",
            url: getConfig("api").host + getConfig("api").root + "/products/stock/",
            headers: {
                "ph-access-token": token
            },
            data: stockData
        }

        const response = await xttp(input);
        if (response.code !== 200) {
            alert(response.code + ", " + response.error);
        }

        dispatch({
            type: "UPDATE_STOCK",
            payload: response.data
        });
    }
}

export function updateLocalProduct(data) {
    return function (dispatch) {
        dispatch({
            type: "UPDATE_LOCAL_PRODUCT",
            payload: data
        });
    }
}

export function updateLocalStock(data) {
    return function (dispatch) {
        dispatch({
            type: "UPDATE_LOCAL_STOCK",
            payload: data
        });
    }
}

export function fetchCustomProductSuggestion(token, q) {
    return async function (dispatch) {
        const input = {
            method: "get",
            url: getConfig("api").host + getConfig("api").root + "/customProducts/?q=" + q,
            headers: {
                "ph-access-token": token
            }
        }

        const response = await xttp(input);
        if (response.code !== 200) {
            alert(response.code + ", " + response.error);
        }

        dispatch({
            type: "CUSTOM_PRODUCT_SUGGESTIONS",
            payload: response.data
        });
    }
}

export function deleteProduct(productId, token) {
    return async function(dispatch) {
        const input = {
            method: "DELETE",
            url: getConfig("api").host+getConfig("api").root+'/products',
            headers: {
                "ph-access-token": token
            },
            data: {
                _id: productId
            }
        }

        const response = await xttp(input);
        if(response.code !== 200) {
            alert(JSON.stringify(response));
        }

        dispatch({
            type: "DELETE_PRODUCT",
            payload: response.data
        })
    }
}

export function newProductList(token) {
    return async function(dispatch) {
        const input = {
            method: "GET",
            url: getConfig("api").host+getConfig("api").root+'/products',
            headers: {
                "ph-access-token": token
            }
        }

        const response = await xttp(input);

        console.log('new Product list res',response)

        if(response.code !== 200) {
            alert(JSON.stringify(response));
        }

        dispatch({
            type: "GET_NEW_PRODUCT_LIST",
            payload: response.data
        })
    }
}