import React from "react";
import {
    View,
    TouchableOpacity
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import TextView from "../../../../../core/TextView";

import styles from "./styles";

export default class SettingsMenuRow extends React.Component {
    render() {
        const { menu } = this.props;
        return(
            <View>
                {
                    menu.map((item, index) => {
                        const wrapperStyle = [ styles.menuContainer, styles.dividerStyle ];

                        return (
                            <TouchableOpacity 
                                style = { wrapperStyle }
                                onPress = { item.action }>
                                <View style = { styles.menuWrapper }>
                                    <View style = { styles.menuLabelContainer }>
                                        <TextView style = { styles.menuLabel }>
                                            { item.label }
                                        </TextView>
                                    </View>
                                    <View style = { styles.iconContainer }>
                                        <Ionicons name="ios-arrow-forward" size={24} color={"#000"} />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                    })
                }
            </View>
        );
    }
}