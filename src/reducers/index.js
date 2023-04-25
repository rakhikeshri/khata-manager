import { combineReducers } from "redux";
import auth from "./authReducers";
import orders from "./orderReducers";
import customers from "./customerReducers";
import products from "./productReducers";
import report from './reportReducers';
import common from './commonReducer';
import unit from './unitReducers';

import { navigationReducer as nav } from "./../common/ReduxNavigationHelper";

export default combineReducers({
    auth,
    orders,
    customers,
    products,
    report,
    unit,
    common,
    nav
})