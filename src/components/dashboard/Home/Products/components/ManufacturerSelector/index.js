import React from "react";
import { SafeAreaView } from "react-native";
import TextView from "core/TextView";

export default class ManufacturerSelector extends React.Component {
    render() {
        return(
            <SafeAreaView>
                <TextView>
                    Select Manufacturer Here
                </TextView>
            </SafeAreaView>
        )
    }
}