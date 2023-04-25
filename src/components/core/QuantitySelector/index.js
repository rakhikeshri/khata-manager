import React from "react";
import {
    TouchableOpacity,
    View
} from "react-native";
import TextView from "core/TextView";
import { Ionicons } from "@expo/vector-icons";

export default class QuantitySelector extends React.Component {
    state = {
        count: this.props.count ? this.props.count : 0,
        bounds: this.props.bounds ? this.props.bounds: {
            min: 0,
            max: "infinite"
        }
    }

    componentDidUpdate = (prevProps) => {
        if(this.props.count !== prevProps.count) {
            this.setState({
                count: this.props.count
            })
        }

        if (this.props.bounds !== prevProps.bounds) {
            this.setState({
                bounds: this.props.bounds
            })
        }
    }

    updateCount = (type = "inc") => {
        const { bounds } = this.state;
        let addParam = 1;
        if(type === "dec") {
            addParam = -1;
        }
        
        const count = this.state.count + addParam;

        if (bounds.max !== -1 && (count < bounds.min || count > bounds.max)) {
            return;
        }

        this.setState({
            count,
        }, () => {
            if (this.props.onChange) {
                this.props.onChange(type, this.state.count);
            }
        });
    }

    render() {
        const style = {
            alignItems:'center', 
            justifyContent:'center', 
            backgroundColor:'#848484', 
            width:20, 
            height:20
        }

        const propStyle = this.props.style || {};

        const leftStyle = {
            ...style,
            borderTopLeftRadius:6,
            borderBottomLeftRadius:6,
            ...propStyle
        }

        const rightStyle = {
            ...style,
            borderTopRightRadius:6,
            borderBottomRightRadius:6,
            ...propStyle
        }

        return (
            <View style={{flexDirection:'row'}}>
                <TouchableOpacity onPress={this.updateCount.bind(this, "dec")} style={leftStyle}>
                    <Ionicons name="md-remove" size={10} color={"#fff"} />
                </TouchableOpacity>
                <View style={{alignItems:'center', justifyContent:'center', backgroundColor:'#fff',width:40}}>
                    <TextView style={{color:'#242424'}}>{this.state.count}</TextView>
                </View>
                <TouchableOpacity onPress={this.updateCount.bind(this, "inc")} style={rightStyle}>
                    <Ionicons name="md-add" size={10} color={"#fff"} />
                </TouchableOpacity>
            </View>
        )
    }
}