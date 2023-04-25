import React from "react";
import {
    Text
} from "react-native";

import {
    normalize
} from "common/ResponsiveFontSize";

export default class TextView extends React.Component {
    render() {
        const { style } = this.props;
        const fontStyle = {
            // fontFamily: "Roboto"
        };

        let textStyle;

        if (Array.isArray(style)) {
            textStyle = Object.assign([], style);
            textStyle.push(fontStyle);
        } else {
            textStyle = {
                ...style,
                ...fontStyle
            }
        }
        
        return <Text style = { textStyle } allowFontScaling = {false}>
            { this.props.children }
        </Text>
    }
}