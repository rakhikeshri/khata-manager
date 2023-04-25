import store from "./../store";

// handle store
export function handleReduxNavigation(prevState, currentState) {
    store.dispatch(navigationAction(currentState));
}

// get navigation state from store
export function getNavigationState() {
    const state = store.getState();
    return state.nav ? state.nav.nav : {};
}

// action
export function navigationAction(newState) {
    return function(dispatch) {
        dispatch({
            type: "ROUTE_CHANGED",
            payload: newState
        })
    }
}

// reducer
export function navigationReducer(state = {
    nav: {}
}, action) {
    switch(action.type) {
        case "ROUTE_CHANGED": {
            return { ...state, nav: action.payload }
        }
    }

    return state;
}