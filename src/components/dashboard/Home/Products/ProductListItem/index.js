import React from "react";
import {
    View,
    Animated,
    TouchableOpacity,
} from "react-native";
import Swipeable from 'react-native-gesture-handler/Swipeable';
import TextView from "core/TextView";
import moment from 'moment';
import styles from "./styles";
import { Ionicons } from "@expo/vector-icons";

import { deleteProduct } from "./../../../../../actions/productActions";

export default class ProductListItems extends React.Component {
    swipeRight = (progress, dragX) =>{
        const { data } = this.props;
        const scale = dragX.interpolate({
          inputRange:[-200, 0],
          outputRange:[1, 0.5],
          extrapolate:'clamp'
        });

        return(
          <Animated.View style={{
              backgroundColor:'#D53D69',
              width: 100,
              marginTop: 10,
              marginBottom: 10,
              justifyContent:'center',
              borderRadius: 8,
            }}>
                <TouchableOpacity onPress={this.removeItem.bind(this, data._id)} style={{alignItems:'center', justifyContent:'center'}}>
                    <Ionicons name="md-trash" size={28} color={"#fff"} />
                </TouchableOpacity>
          </Animated.View>
        )
    }

    removeItem(id) {
        const { user, dispatch, deletedProduct } = this.props;
        deletedProduct(id);
        dispatch(deleteProduct(id, user.accessToken));
    }

    render() {
        const { navigation, data } = this.props;

        if (!data || data === null) {
            return null;
        }

        const{ smallestUnit } = data;
        
        return (
            <Swipeable renderRightActions={this.swipeRight} rightThreshold={-200}>
                <TouchableOpacity style={[styles.product]} onPress={() => navigation.navigate('ProductDetail',{product: data})}>
                    <View style={{flex:1, flexDirection:'row'}}>
                        <View style={{flex:1, flexDirection:'column', padding: 4}}>
                            <TextView style={{fontSize:16, color:'#282828', fontWeight:'bold'}}>{data.name}</TextView>
                            <TextView style={{fontSize:12, color:'#282828'}}>{data.manufacturer}</TextView>
                        </View>
                        {
                            data.expiry ? (
                                <View style={{flex:1, flexDirection:'row',justifyContent:'flex-end', padding:4}}>
                                    <TextView style={{fontSize:16, color:'#2f7eb9'}}>{'Expiry - '}</TextView>
                                    <TextView style={{fontSize:16, color:'#2f7eb9'}}>{moment(data.expiry).format("YYYY/MM/DD")}</TextView>
                                </View>
                            ) : null
                        }
                    </View>
                    <View style={{flex:1, flexDirection:'row'}}>
                        <View style={{flex:1, flexDirection:'column', padding:4, justifyContent: "flex-end"}}>
                            {
                                data.hsn ? (
                                    <View style={{flexDirection:'row'}}>
                                        <TextView style={{fontSize:16, color:'#282828'}}>{'HSN - '}</TextView>
                                        <TextView style={{fontSize:16, color:'#d74678', fontWeight:'bold'}}>{data.hsn}</TextView>
                                    </View>
                                ) : null
                            }
                            <View style={{flexDirection:'row'}}>
                                <TextView style={{fontSize:16, color:'#282828'}}>{'PID - '}</TextView>
                                <TextView style={{fontSize:16, color:'#282828'}}>{data.pid}</TextView>
                            </View>
                        </View>
                        <View style={{flex:1, flexDirection:'column',padding:4, alignItems:'flex-end'}}>
                            <TextView style={{fontSize:16, color:'#86cf6b'}}>{data.availableQuantity !== -1 ? data.availableQuantity + '  ' +  'Available' : <Ionicons name="md-infinite" size={33} color={"#000"} />}</TextView>
                            <View style={{flexDirection:'row', flex:1}}>
                                <TextView style={{fontSize:16, color:'#282828'}}>{'MRP - '}</TextView>
                                {
                                    smallestUnit && smallestUnit !== null ? (
                                        <TextView style={{fontSize:16, color:'#282828', fontWeight:'bold'}}>{"₹"+ smallestUnit.rpu + "/" + smallestUnit.label + ' '}</TextView>
                                    ) : (
                                        <TextView style={{fontSize:16, color:'#282828', fontWeight:'bold'}}>{"₹"+ data.price + ' '}</TextView>
                                    )
                                }
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </Swipeable>
        )
    }
}