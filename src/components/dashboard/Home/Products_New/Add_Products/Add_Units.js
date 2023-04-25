import React, { Component } from "react";
import {
    Text,
    StyleSheet,
    View,
    SafeAreaView,
    TouchableOpacity,
    Image,
    Modal,
    TextInput,
} from "react-native";
import Nav_Head from "../../Nav_Head";
import { Checkbox } from 'expo-checkbox';
import list from './List'
import list2 from "./List2";
import { customStyles } from "../../Generic_Styles";


export default class Add_Products extends Component {

    state = {
        checkBox1: false,
        checkBox2: false,
        list1: list,
        list2: list2
    };

    addMore = () => {
        this.setState({
            checkBox1: !this.state.checkBox1,
        });
    };

    done = () => {
        this.setState({
            checkBox2: !this.state.checkBox2
        })
    }

    onChecked(id) {
        const checkData1 = this.state.list1
        const index = checkData1.findIndex(checkbox => checkbox.id === id)
        if (checkData1[index].disabled != true) {
            checkData1[index].checked = !checkData1[index].checked
        }
        this.setState(checkData1)
    }

    onChecked2(id) {
        const checkData2 = this.state.list2
        const index = checkData2.findIndex(checkbox => checkbox.id === id)
        checkData2[index].checked = !checkData2[index].checked
        this.setState({ list2: checkData2 })
    }

    render() {
        const { list1 } = this.state
        const { list2 } = this.state
        const { checkBox1 } = this.state
        const { checkBox2 } = this.state

        return (
            <SafeAreaView style={customStyles.container}>

                <Nav_Head title='Add Products' />

                <View style={styles.mainContainer}>

                    <TextInput placeholder="Product Name" style={customStyles.inputBox} />
                    <TextInput placeholder="Manufacturer" style={customStyles.inputBox} />

                    <View style={styles.innerContainer}>

                        <View style={customStyles.centerView}>
                            <Text style={{ width: '70%' }}>- Tablet - Rs 2 - Cfactor 1</Text>
                            <Text style={[customStyles.draft_complete_box, styles.smallest_pink]}>Smallest</Text>
                        </View>

                        <View style={customStyles.centerView}>
                            <Text style={{ width: '70%' }}>- Tablet - Rs 2 - Cfactor 1</Text>
                            <Text style={[customStyles.draft_complete_box, styles.smallest_white]}>Smallest</Text>
                        </View>

                        <Text style={[customStyles.draft_complete_box, styles.add_unit]}>+ Add Unit</Text>
                    </View>

                    <View style={styles.btns_container}>
                        <TextInput placeholder="CGST" style={customStyles.inputBox} />
                        <TextInput placeholder="SGST" style={customStyles.inputBox} />
                        <TextInput placeholder="IGST" style={customStyles.inputBox} />
                        <View style={{ flexDirection: 'row' }}>
                            <TextInput placeholder="Qty" style={[customStyles.inputBox,]} />
                            <Image source={require("../../../../assets/qty_attached_icon.png")} />
                        </View>
                    </View>

                </View>

                <TouchableOpacity style={[customStyles.genericBtn, { backgroundColor: '#1CBC9B' }]} activeOpacity={0.7} onPress={this.addMore}>
                    <Text style={[customStyles.genericModalBtnText, { color: "#FFFFFF" }]}>+ Add More</Text>
                </TouchableOpacity>

                {
                    checkBox1 === true ? (
                        <Modal transparent={true}>
                            <View style={styles.genericTransparentModal} >
                                <View style={styles.genericModalBox}>
                                    <View style={{ paddingHorizontal: 22, paddingVertical: 32, gap: 15 }}>
                                        {
                                            list1.map((item, key) => {
                                                return (
                                                    <TouchableOpacity
                                                        key={key}
                                                        style={{ flexDirection: "row", gap: 10 }}
                                                        onPress={() => { this.onChecked(item.id) }}
                                                        activeOpacity={.7}
                                                    >
                                                        <Checkbox
                                                            value={item.checked}
                                                            style={{ borderRadius: 4 }}
                                                            onValueChange={() => { this.onChecked(item.id) }}
                                                        />
                                                        <Text>{item.value}</Text>
                                                    </TouchableOpacity>
                                                )
                                            })
                                        }
                                    </View>

                                    <View style={{ flexDirection: 'row' }}>
                                        <TouchableOpacity style={[customStyles.genericModalBtn, { backgroundColor: '#EDF2F3', borderBottomStartRadius: 8, }]}
                                            activeOpacity={0.7} onPress={this.addMore}>
                                            <Text style={[styles.genericModalBtnText, { color: "#3C3C3C" }]}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[customStyles.genericModalBtn, { backgroundColor: '#1CBC9B', borderBottomEndRadius: 8, }]} onPress={this.done} activeOpacity={0.7}>
                                            <Text style={[styles.genericModalBtnText, { color: "#FFFFFF" }]}>Done</Text>
                                        </TouchableOpacity>
                                    </View>

                                </View>
                            </View>
                        </Modal>
                    ) : null
                }


                {
                    checkBox2 === true ? (
                        <Modal transparent={true}>
                            <View style={customStyles.genericTransparentModal} >
                                <View style={customStyles.genericModalBox}>
                                    <View style={{ paddingHorizontal: 22, paddingVertical: 32, gap: 15 }}>
                                        {
                                            list2.map((item, key) => {
                                                if (item.input === true) {
                                                    return (
                                                        <View style={customStyles.checkBoxContainer}>
                                                            <TouchableOpacity key={key} style={{ flexDirection: "row", gap: 10 }} onPress={() => { this.onChecked2(item.id) }} activeOpacity={.7}>
                                                                <Checkbox value={item.checked} style={{ borderRadius: 4 }} onValueChange={() => { this.onChecked2(item.id) }} />
                                                                <Text>{item.valueDark}</Text>
                                                                <Text>{item.valueLight}</Text>
                                                            </TouchableOpacity>
                                                            <TextInput style={[customStyles.inputBox, { borderWidth: 1 }]} placeholder={item.placeHolder} />
                                                        </View>
                                                    )
                                                } else {
                                                    return (
                                                        <View style={customStyles.checkBoxContainer}>
                                                            <TouchableOpacity key={key} style={{ flexDirection: "row", gap: 10 }} onPress={() => { this.onChecked2(item.id) }} activeOpacity={.7}>
                                                                <Checkbox value={item.checked} style={{ borderRadius: 4 }} onValueChange={() => { this.onChecked2(item.id) }} />
                                                                <Text>{item.valueDark}</Text>
                                                                <Text>{item.valueLight}</Text>
                                                            </TouchableOpacity>
                                                        </View>

                                                    )
                                                }
                                            })
                                        }
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <TouchableOpacity style={[customStyles.genericModalBtn, { backgroundColor: '#EDF2F3', borderBottomStartRadius: 8, }]}
                                            activeOpacity={0.7} onPress={this.done}>
                                            <Text style={[customStyles.genericModalBtnText, { color: "#3C3C3C" }]}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[customStyles.genericModalBtn, { backgroundColor: '#1CBC9B', borderBottomEndRadius: 8, }]} activeOpacity={0.7}>
                                            <Text style={[customStyles.genericModalBtnText, { color: "#FFFFFF" }]}>Done</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    ) : null
                }

                {/* <View style={{ flexDirection: 'row', position:'absolute', top: '100%' }}>
                    <TouchableOpacity style={[customStyles.genericModalBtn, { backgroundColor: '#EDF2F3' }]} >
                        <Text style={[customStyles.genericModalBtnText, { color: "#3C3C3C" }]}>Save as draft</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[customStyles.genericModalBtn, { backgroundColor: '#1CBC9B' }]} >
                        <Text style={[customStyles.genericModalBtnText, { color: "#FFFFFF" }]}>Submit</Text>
                    </TouchableOpacity>
                </View> */}

            </SafeAreaView>
        );
    }
}


const styles = StyleSheet.create({

    mainContainer: {
        marginVertical: 25,
        borderRadius: 8,
        gap: 12,
        backgroundColor: '#EDF2F3',
        padding: 14,
    },

    innerContainer: {
        backgroundColor: '#D8E2E4',
        padding: 10,
        gap: 6,
        alignItems: 'center'
    },

    checkBoxContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#EBF0F1",
        padding: 8,
        height: 42
    },

    smallest_pink: {
        backgroundColor: '#D43D69', width: '30%', color: '#FFFFFF'
    },

    smallest_white: {
        backgroundColor: '#FFFFFF', width: '30%', color: '#000'
    },

    add_unit: {
        backgroundColor: '#1CBC9B', marginTop: 15, color: '#FFFFFF', width: '35%'
    },
    btns_container:{
        flexDirection: 'row', marginTop: 10, justifyContent: 'space-between'
    }
});
