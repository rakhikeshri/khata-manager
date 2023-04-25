export default function reducer(state = {
    productList: [],
    stockList: [],
    updateStock: {},
    updateProduct: {},
    createProduct: {},
    customProductsSuggestions: [],
    customeProduct: false,
    deleteProduct: null,
    newProductList: []
}, action) {
    switch (action.type) {
        case "PRODUCT_LIST": {
            const { operation } = action;
            let newProductList = Object.assign([], state.productList);
            if (operation === "PUSH") {
                newProductList = [
                    ...state.productList,
                    ...action.payload
                ]
            } else {
                newProductList = action.payload;
            }

            return { ...state, productList: newProductList, customeProduct: false }
        }

        case "PRODUCT_STOCK_LIST": {
            return { ...state, stockList: action.payload, customeProduct: false }
        }

        case "UPDATE_STOCK": {
            return { ...state, updateStock: action.payload, customeProduct: true }
        }

        case "UPDATE_PRODUCT": {
            return { ...state, updateProduct: action.payload }
        }

        case "CREATE_PRODUCT": {
            return { ...state, createProduct: action.payload}
        }

        case "UPDATE_LOCAL_PRODUCT" : {
            return { ...state, productList: action.payload }
        }

        case "UPDATE_LOCAL_STOCK": {
            return { ...state, stockList: action.payload }
        }

        case "CUSTOM_PRODUCT_SUGGESTIONS": {
            return { ...state, customProductsSuggestions: action.payload, customeProduct: false }
        }

        case "DELETE_PRODUCT": {
            return { ...state, deleteProduct: action.payload }
        }

        case "GET_NEW_PRODUCT_LIST": {
            return { ...state, newProductList: action.payload }
        }


    }

    return state;
}