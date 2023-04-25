import React from "react";
import {
    View,
    StatusBar
} from "react-native";

import SettingsMenuRow from "./components/SettingsMenuRow";

export default class Settings extends React.Component {
    state = {
        settingMenu: [
            {
                label: "Invoice",
                action: () => this.navigate("InvoiceSettings")
            },
            {
                label: "Payment"
            },
            {
                label: "Orders"
            }
        ]
    }

    navigate = (path) => {
        const { navigation } = this.props;
        navigation.navigate(path);
    }

    render () {
        const { settingMenu } = this.state;
        return (
            <View>
                <StatusBar barStyle="dark-content" backgroundColor="#1CBD9C" translucent = {false } />
                <SettingsMenuRow menu = {settingMenu} />
            </View>
        );
    }
}