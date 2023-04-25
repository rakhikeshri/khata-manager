import React from "react";
import {
    View,
    TouchableOpacity,
    StatusBar
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import TextView from "../../../../core/TextView";

import styles from "./styles";

export default class InvoiceSettings extends React.Component {    
    componentDidMount = () => {
        const actions = [
            {
                action: this.update,
                icon: "ios-checkmark",
                iconSize: 40
            }
        ];

        this.props.navigation.setOptions({
            headerRight: this.getActionsContainers(actions)
        });
    }

    getActionsContainers = (actions) => {
        if (actions) {
            return {
                headerRight: () => actions.map((actionItem) => {
                    return (
                        <TouchableOpacity 
                            style = {{
                                width: 60,
                                height: 58,
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                            onPress = {actionItem.action}
                        >
                            <Ionicons name = {actionItem.icon} size={actionItem.iconSize} color={"#fff"} />
                        </TouchableOpacity>
                    )
                })
            };
        } else {
            return {};
        }
    }

    update = () => {

    }

    handleInput = (type, value) => {
        console.log(type, value);
    }

    render () {
        return (
            <View style = { styles.container }>
                <StatusBar barStyle="dark-content" backgroundColor="#1CBD9C" translucent = {false } />
                <View style = { styles.sectionContainer }>
                    <View style = { styles.titleContainer }>
                        <TextView style = { styles.titleLabel }>
                            Preferred Invoice Type
                        </TextView>
                    </View>
                    <View style = { styles.actionsContainer }>
                        <View style = { styles.pickerContainer }>
                            <Picker
                                style={ styles.picker }
                                onValueChange={(itemValue, itemIndex) => this.handleInput("invoiceType", itemValue)}
                            >
                                <Picker.Item label="A4" value="A4" />
                                <Picker.Item label="POS" value="POS" />
                            </Picker>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}