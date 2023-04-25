export default function reducer(state = {
    scanned: [],
    createBillPayload: {
        customerPhone: "",
        products: [],
        paymentMethod: "CASH",
        paymentRefNo: ""
    },
    customerDetails: null,
    moreOrder: true,
    addedCustomer: {},
    createOrder: {},
    orderList: [],
    sendSms: {},
    settlePayment: {},
    deleteOrder: null
}, action) {
    switch(action.type) {
        case "SCAN_PRODUCT" : {
            return { ...state, scanned: action.payload}
        }

        case "CREATE_BILL_PAYLOAD": {
            return { ...state, createBillPayload: action.payload }
        }

        case "GET_CUSTOMER_DETAILS": {
            return { ...state, customerDetails: action.payload }
        }

        case "SAVE_CUSTOMER_DETAILS": {
            return { ...state, addedCustomer: action.payload }
        }

        case "CREATE_ORDER" : {
            return { ...state, createOrder: action.payload }
        }

        case "SETTLE_PAYMENT": {
            return { ...state, settlePayment: action.payload }
        }

        case "LOCAL_UPDATE_ORDER_LIST": {
            return { ...state, orderList: action.payload }
        }

        case "RESET_ORDER" : {
            return {...state, createOrder: {}}
        }

        case "ORDER_LIST": {
            const { operation, moreOrder } = action;
            let newOrderList = Object.assign([], state.orderList);
            if (operation === "PUSH") {
                newOrderList = [
                    ...state.orderList,
                    ...action.payload
                ]
            } else {
                newOrderList = action.payload;
            }

            return { ...state, orderList: newOrderList, moreOrder }
        }

        case "SEND_MESSAGE": {
            return { ...state, sendSms: action.payload }
        }

        case "DELETE_ORDER" : {
            return { ...state, deleteOrder: action.payload }
        }
    }

    return state;
}