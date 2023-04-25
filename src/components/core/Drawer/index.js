import React from "react";
import { connect } from "react-redux";
import {
    View,
    Image,
    TouchableOpacity
} from "react-native";
import TextView from "../TextView";
import {
    DrawerContentScrollView,
  } from '@react-navigation/drawer';

import styles from "./styles";

import { logoutAction } from "./../../../actions/authActions";

const logoutIcon = require("./../../../../assets/images/logout.png");

@connect((store) => {
    return {
        nav: store.nav.nav,
        user: store.auth.user,
        scanned: store.orders.scanned
    }
})
export default class Drawer extends React.Component {
    logout = () => {
        const { navigation } = this.props;
        navigation.toggleDrawer() 
        this.props.dispatch(logoutAction(this.props.navigation, this.props.user.email));
    }

    navigate = (path) => {
        const { navigation } = this.props;
        navigation.toggleDrawer();
        navigation.navigate(path);
    }

    render () {
        const { user } = this.props;
        console.log(user)
        
        return (
            <DrawerContentScrollView {...this.props}>
                {/* drawer header */}
                <View style = {styles.header}>
                    <View style = {styles.headerWrapper}>
                        <TextView style = {styles.userNameText}>
                            {user.name}
                        </TextView>
                        <TextView style = {styles.shopNameText}>
                            {user && user.shops ? user.shops[0].name: "-"}
                        </TextView>
                    </View>
                </View>
                {/* menu */}
                <View style = {styles.menuWrapper}>
                    {/* menu item */}
                    {/* <TouchableOpacity
                        onPress = { () => this.navigate("Settings") }
                        style = {styles.menuItemWrapper}>
                        <Image 
                            source = {logoutIcon} 
                            style = {styles.menuIcon} />
                        <TextView style = {styles.menuItemText}>
                            Settings
                        </TextView>
                    </TouchableOpacity> */}

                    {/* menu item */}
                    <TouchableOpacity
                        onPress = {this.logout}
                        style = {styles.menuItemWrapper}>
                        <Image 
                            source = {logoutIcon} 
                            style = {styles.menuIcon} />
                        <TextView style = {styles.menuItemText}>
                            Logout
                        </TextView>
                    </TouchableOpacity>
                </View>
            </DrawerContentScrollView>
        )
    }
}