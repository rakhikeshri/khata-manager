import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationActions, StackActions } from "react-navigation";
import { CommonActions } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import * as qs from "qs";
import { loginAction } from "./../actions/authActions";
import * as Permissions from 'expo-permissions';

const STORE_NAME = "@ThePhStore";

export async function checkIfLoggedIn(dispatch, navigation) {
    try {
        const userData = await getFromLocal("ph_user_data");

        if(userData && Object.keys(userData).length !== 0) {
            dispatch(loginAction(navigation, false, userData));

            return true;
        }

        return false;
    } catch (e) {
        console.log(e);

        return false;
    }
}

// Navigation ------
export function resetStackNavigationTo(navigation, navigationObject, index = 0, multiple = false) {
    const navAction = multiple ? navigationObject.map((nav) => {
        return nav
    }) : [
        navigationObject
    ]

    const resetAction = CommonActions.reset({
        index: index,
        routes: navAction
    });

    navigation.dispatch(resetAction);
}

// Async Storage --------
// save to local
export async function saveToLocal(key, data) {
    try {
        await AsyncStorage.setItem(STORE_NAME+":"+key, data);

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

// get from local
export async function getFromLocal(key) {
    try {
        const value = await AsyncStorage.getItem(STORE_NAME+":"+key);
        if (value !== null) {
            return JSON.parse(value);
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}

// remove from local
export async function removeFromLocal(key) {
    try {
        await AsyncStorage.removeItem(STORE_NAME+":"+key);
        return true;
    } catch(e) {
        console.log(e);
        return false;
    }
}

export const errorMessage = (title, message, Ok, Cancel) => {
    Alert.alert(
        title,
        message,
        [    
            {       
                text: Cancel,       
                onPress: () => console.log('Cancel Pressed'),       
                style: 'Cancel',     
            },     
            {
                text: 'Ok', 
                onPress: () => console.log('OK Pressed')
            },   
        ],   
        { cancelable: false }, 
    );
}

export const downloadFile = async (url, headers, path) => {
    const { status } = await Permissions.askAsync(
        Permissions.CAMERA_ROLL
    );

    const notif = await Permissions.askAsync(Permissions.NOTIFICATIONS);

    if (notif.status !== 'granted') {
        alert('No notification permissions!');
        return;
    }

    if (status === "granted") {
        const downloadResumable = FileSystem.createDownloadResumable(
            url,
            "file:///storage/emulated/0/Download/"+path,
            {
                headers: headers
            },
            (downloadProgress) => {
                const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
            }
        );
    
        try {
            const { uri } = await downloadResumable.downloadAsync();
            
            return uri;
        } catch (e) {
            return e;
        }
    }
}

export function getFormatedDateTime(dateString) {
    const d = new Date(dateString);
    let date = d.getDate().toString();
    date = date.length === 1 ? "0"+date : date;

    let month = (d.getMonth() + 1).toString();
    month = month.length === 1 ? "0"+month : month;
    
    const year = d.getFullYear();

    let ampm = "AM";
    let hr = d.getHours();

    if(hr >= 13) {
        hr = 1;
        ampm = "PM";
    }

    if (hr >= 24) {
        hr = 0;
        ampm = "AM";
    }

    hr = hr.toString().length === 1 ? "0"+hr : hr.toString();
    let min = d.getMinutes();
    min = min.toString().length === 1 ? "0"+min : min.toString();

    return date+"/"+month+"/"+year+" "+hr+":"+min+" "+ampm;
}

export function getFormatedDate(dateString) {
    const d = new Date(dateString);
    let date = d.getDate().toString();
    date = date.length === 1 ? "0"+date : date;

    let month = (d.getMonth() + 1).toString();
    month = month.length === 1 ? "0"+month: month;
    
    const year = d.getFullYear();

    return date+"/"+month+"/"+year;
}

export function toQueryString(queryObj) {
    return qs.stringify(queryObj, {
        encode: false
    })
}