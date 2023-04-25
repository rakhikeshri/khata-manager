export default function reducer(state = {
    customerList: [],
    customer: {}
}, action) {
    switch(action.type) {
        case "CUSTOMER_LIST":{
            return {...state, customerList: action.payload}
        }

        case "SAVE_CUSTOMER": {
            return { ...state, customer: action.payload }
        }
    }

    return state;
}