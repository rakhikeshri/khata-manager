import React from "react";
import { connect } from "react-redux";
import {
    View,
    ActivityIndicator
} from "react-native";

import TextView from "core/TextView";

import { checkIfLoggedIn, resetStackNavigationTo, getFromLocal } from "./../../common/utils";

// style
// import styles from "./styles";

@connect((store) => {
    return {
        user: store.auth.user
    }
})
export default class LoadingScreen extends React.Component {

    async componentDidMount() {
        const { navigation, dispatch } = this.props;
        const userData = await getFromLocal("ph_user_data");
        
        if(userData && Object.keys(userData).length !== 0) {
            await checkIfLoggedIn(dispatch, navigation)
        } else {
            this.goToLogin(navigation)
        }
    }

    goToLogin(navigation) {
        resetStackNavigationTo(navigation, { name: 'Login' });
    }
    
    render() {
        return (
            <View style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: '5%',
                bottom: 0,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor:'transparent',
            }}>
                <View style={{backgroundColor:'#ccc', width:40, height:40, borderRadius:20}}>
                    <ActivityIndicator size='large' color="#20BC9B"/>
                </View>
            </View>
        )
    }
}
