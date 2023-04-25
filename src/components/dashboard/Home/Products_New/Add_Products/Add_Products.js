import React, { Component } from "react";
import {
    Text,
    StyleSheet,
    View,
    SafeAreaView,
    TouchableOpacity,
    Image,
    StatusBar,
    Platform,
    Modal,
    TextInput,
    ScrollView
} from "react-native";
import list from './List'

import { customStyles } from "../../Generic_Styles"
import { Checkbox } from 'expo-checkbox';

let selectedCheckedValue = []

export default class Add_Products extends Component {

    state = {
        checkBox1: false,
        list1: list,
        showInputFields: false,
        populateFields: false,
        addingNewFields: []
    };

    addMore = () => {
        this.setState({
            checkBox1: !this.state.checkBox1,
        });
    };

    done = () => {
        this.setState({
            showInputFields: true,
            checkBox1: false
        })
    }

    onChecked(id) {
        const checkData1 = this.state.list1
        const index = checkData1.findIndex(checkbox => checkbox.id === id)

        if (checkData1[index].disabled != true) {
            checkData1[index].checked = !checkData1[index].checked
            const val = checkData1[index].value
            if (checkData1[index].checked === true) {
                selectedCheckedValue.push(val)
            } else {
                selectedCheckedValue = selectedCheckedValue.filter(item => item !== val)
            }
        }
        this.setState(checkData1)
        // console.warn(selectedCheckedValue)
    }

    populateFields = () => {
        this.setState({
            populateFields: true,
        })

        this.state.addingNewFields.push('added new')
    }

    submit = () => {
        this.setState({
            showInputFields: false,
            populateFields: false
        })

        this.state.list1.map(item => {
            if (item.disabled === false) {
                item.checked = false
            }
        })

        selectedCheckedValue = []
        this.state.addingNewFields = []
    }

    render() {

        const { checkBox1, list1, showInputFields, populateFields, addingNewFields } = this.state

        return (
            <View>
                <ScrollView>

                    {/* initial page view toggle */}

                    {
                        showInputFields === true ? (
                            <View style={styles.mainContainer}>

                                <TextInput placeholder="Product Name" style={customStyles.inputBox} />
                                {
                                    selectedCheckedValue.length > 0 ? (
                                        selectedCheckedValue.map(item =>
                                            <TextInput placeholder={item} style={customStyles.inputBox} />
                                        )
                                    ) : null
                                }

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
                                        <Image source={require("../../../../../../assets/images/Product_img/qty_attached_icon.png")} />
                                    </View>
                                </View>

                            </View>
                        ) : (
                            <View style={{ marginTop: 10, marginBottom: 30, gap: 12 }}>
                                <View style={[customStyles.genericList, customStyles.centerView, { borderRadius: 8 }]}>
                                    <View style={{ gap: 12, width: '70%' }}>
                                        <Text>Session of (04/04/2023 04:00 PM) </Text>
                                        <Text style={{ fontWeight: 500 }}>54 Products added currently</Text>
                                        <Text style={[customStyles.draft_complete_box, { backgroundColor: '#BAC5C8', width: '40%' }]} >Drafts</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', gap: 15, width: '30%' }}>
                                        <TouchableOpacity>
                                            <Image source={require("../../../../../../assets/images/Product_img/addProducts_editIcon.png")} />
                                        </TouchableOpacity>
                                        <TouchableOpacity>
                                            <Image source={require("../../../../../../assets/images/Product_img/addProducts_copyIcon.png")} />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <View style={[customStyles.genericList, customStyles.centerView, { borderRadius: 8 }]}>
                                    <View style={{ gap: 12, width: '70%' }}>
                                        <Text>Session of (04/04/2023 04:00 PM)</Text>
                                        <Text style={{ fontWeight: 500 }}>54 Products added currently</Text>
                                        <Text style={[customStyles.draft_complete_box, { backgroundColor: '#1CBC9B', width: '50%' }]}>Completed</Text>
                                    </View>
                                </View>

                            </View>
                        )
                    }

                    {/* initial addmore button   */}

                    {
                        showInputFields === false ? (
                            <TouchableOpacity style={[customStyles.genericBtn, { backgroundColor: '#1CBC9B', marginHorizontal: 10 }]} activeOpacity={0.8} onPress={this.addMore}>
                                <Text style={[customStyles.genericBtnText, { color: '#FFFFFF' }]} >+Add More</Text>
                            </TouchableOpacity>
                        ) : null
                    }


                    {/* creating same input fields format after clicking on add more button  */}
                    {
                        populateFields === true && showInputFields === true ? (
                            addingNewFields.length > 0 ? (
                                addingNewFields.map(item => (
                                    <View style={styles.mainContainer}>

                                        <TextInput placeholder="Product Name" style={customStyles.inputBox} />
                                        {
                                            selectedCheckedValue.length > 0 ? (
                                                selectedCheckedValue.map(item =>
                                                    <TextInput placeholder={item} style={customStyles.inputBox} />
                                                )
                                            ) : null
                                        }

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
                                                <Image source={require("../../../../../../assets/images/Product_img/qty_attached_icon.png")} />
                                            </View>
                                        </View>

                                    </View>
                                ))
                            ) : null
                        ) : null
                    }

                    {/* add more button for the next slide */}

                    {
                        showInputFields === true ? (
                            <TouchableOpacity style={[customStyles.genericBtn, { backgroundColor: '#1CBC9B', marginHorizontal: 10 }]} activeOpacity={0.8} onPress={this.populateFields}>
                                <Text style={[customStyles.genericBtnText, { color: '#FFFFFF' }]} >+Add More2</Text>
                            </TouchableOpacity>
                        ) : null
                    }

                    {/* showing model with checkboxes */}

                    {
                        checkBox1 === true ? (
                            <Modal transparent={true}>
                                <View style={customStyles.genericTransparentModal} >
                                    <View style={customStyles.genericModalBox}>
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

                    {/* draft and submit button  */}

                    {
                        showInputFields === true ? (
                            <View style={{ flexDirection: 'row', marginTop: 30, marginHorizontal: 10 }}>
                                <TouchableOpacity style={[customStyles.genericModalBtn, { backgroundColor: '#EDFDF3', borderBottomStartRadius: 8, }]}
                                    activeOpacity={0.7} onPress={this.addMore}>
                                    <Text style={[styles.genericModalBtnText, { color: "#3C3C3C" }]}>Save as draft</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[customStyles.genericModalBtn, { backgroundColor: '#1CBC9B', borderBottomEndRadius: 8, }]} onPress={this.submit} activeOpacity={0.7}>
                                    <Text style={[styles.genericModalBtnText, { color: "#FFFFFF" }]}>Submit</Text>
                                </TouchableOpacity>
                            </View>
                        ) : null
                    }

                </ScrollView>
            </View>
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
    btns_container: {
        flexDirection: 'row', marginTop: 10, justifyContent: 'space-between'
    }

});
