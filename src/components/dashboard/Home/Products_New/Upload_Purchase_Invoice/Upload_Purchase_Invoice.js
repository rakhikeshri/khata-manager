
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

export default class Upload_Purchase_Invoice extends Component {
    render() {
        return (
            <SafeAreaView style={customStyles.container}>

                <Nav_Head title="Products" />

                <View style={{marginTop: 60, gap: 30}}>
                    <Text style={{ fontWeight: 400, fontSize: 15 }}>You can upload your purchase invoices here and our support will upload your products in the inventory.</Text>
                    <Text style={{ fontWeight: 400, fontSize: 15 }}>An ETA will be provided once your upload your invoices</Text>
                    <Text style={{ fontWeight: 400, fontSize: 15 }}>Our customer support may contact you.</Text>
                </View>

                <TouchableOpacity style={[customStyles.genericBtn, { marginTop: 60, backgroundColor: '#1CBC9B' }]}>
                    <Text style={[customStyles.genericBtnText, { color: '#FFFFFF' }]}>Upload Invoices</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }
}


const styles = StyleSheet.create({
    
});
