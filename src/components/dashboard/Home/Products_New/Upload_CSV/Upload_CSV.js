
import React, { Component } from "react";
import {
    Text,
    StyleSheet,
    View,
    SafeAreaView,
    TouchableOpacity,
} from "react-native";
import Nav_Head from '../../Nav_Head'
import { customStyles } from "../../Generic_Styles";


export default class Upload_CSV extends Component {
    render() {
        return (
            <SafeAreaView style={customStyles.container}>

                <Nav_Head title='Products' />

                <View style={{ gap: 30 }}>
                    <View style={{ marginTop: 60, gap: 30 }}>
                        <Text style={{ fontWeight: 400, fontSize: 15 }}>
                            Once you download the csv template, you’ll need to fill it up and come back here to upload.
                        </Text>
                        <Text style={{ fontWeight: 400, fontSize: 15 }}>
                            If you need help in filling the csv, please click here
                        </Text>
                    </View>

                    <TouchableOpacity style={[customStyles.genericBtn, { backgroundColor: '#EDF2F3' }]}>
                        <Text style={[styles.genericBtnText, { color: '#000000' }]}>Download Template</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[customStyles.genericBtn, { marginTop: 20, backgroundColor: '#1CBC9B' }]}>
                        <Text style={[styles.genericBtnText, { color: '#FFFFFF' }]}>Upload CSV</Text>
                    </TouchableOpacity>

                </View>

            </SafeAreaView>
        );
    }
}


const styles = StyleSheet.create({

});
