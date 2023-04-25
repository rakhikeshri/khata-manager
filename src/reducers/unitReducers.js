export default function reducer(state = {
    unitDetails: {},
}, action) {
    switch(action.type) {
        case "GET_UNIT_DETAIL":{
            return {...state, unitDetails: action.payload}
        }
       
    }

    return state;
}