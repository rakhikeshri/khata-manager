export default function reducer(state = {
    reports: [],
    outOfStockList:[],
    expiredProduct:[],
    unsettledCustomers: []
}, action) {
    switch(action.type) {
        case "DASHBOARD_REPORT_LIST":{
            return {...state, reports: action.payload}
        }
        case "OUT_OF_STOCK_LIST":{
            return {...state, outOfStockList: action.payload}
        }
        case "EXPIRED_PRODUCT_LIST":{
            return {...state, expiredProduct: action.payload}
        }
        case "DASHBOARD_REPORT_INITIALLY_LIST":{
            return {...state, reports: action.payload}
        }
        case "UNSETTLED_CUSTOMER_LIST": {
            return {...state, unsettledCustomers: action.payload}
        }
    }

    return state;
}