import React from "react";
import { connect } from "react-redux";
import Navigation from "./Navigation";
import { 
    handleReduxNavigation
} from "./../common/ReduxNavigationHelper";

@connect((store) => {
    return {
        nav: store.nav.nav
    }
})
export default class AppNavigator extends React.Component {
    render() {
        return (
            <Navigation 
                onNavigationStateChange={handleReduxNavigation}
            />
        )
    }
}

//////// Not User, Will have to remove /////////////