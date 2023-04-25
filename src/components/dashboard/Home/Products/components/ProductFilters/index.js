import React from "react";
import {
    View,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Modal
} from "react-native";
import TextView from "core/TextView";
import { Ionicons } from "@expo/vector-icons";
import UnitSelector from "./../UnitSelector";
import ManufacturerSelector from "./../ManufacturerSelector";

export default class ProductFilters extends React.Component {
    state = {
        activeSort: this.props.activeSort ? this.props.activeSort : {
            type: null,
            name: null
        },
        unitSelectorModal: false,
        manufacturerSelectorModal: false
    }

    componentDidUpdate = (prevProps) => {
        if (this.props.activeSort !== prevProps.activeSort) {
            this.setState({ activeSort: this.props.activeSort })
        }
    }

    selectUnit = () => {
        this.setState({
            unitSelectorModal: !this.state.unitSelectorModal
        })
    }

    selectManufacturer = () => {
        this.setState({
            manufacturerSelectorModal: !this.state.manufacturerSelectorModal
        })
    }

    sort = (name) => {
        const { activeSort } = this.state;

        if (activeSort.name === name && activeSort.type === "asc") {
            activeSort.type = "desc";
        } else {
            activeSort.type = "asc";
            activeSort.name = name;
        }

        this.setState({
            activeSort
        }, () => {
            // send to parent
            this.props.sort(activeSort)
        })
    }

    renderSorting = () => {
        const { activeSort } = this.state;
        const textStyle = {
            fontSize: 16,
            fontWeight: "bold"
        };

        const activeTextColor = "#1dbd9c";

        return (
            <View style = {{
                width: "100%",
                height: 140,
            }}>
                <View style = {{
                    width: "100%",
                    height: 30,
                    justifyContent: "center"
                }}>
                    <TextView style = {{
                        fontSize: 12,
                        color: "#848484"
                    }}>
                        Sort
                    </TextView>
                </View>
                <View style = {{
                    flex: 1,
                    flexDirection: "row",
                }}>
                    <TouchableOpacity
                        onPress = {this.sort.bind(this, "name")}
                        style = {{
                            flex: 1,
                            justifyContent: "center" 
                        }}
                    >
                        <TextView style = {[
                            textStyle,
                            { 
                                color: activeSort.name === "name" ? activeTextColor : "#000"  
                            }
                        ]}>
                            Name
                        </TextView>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress = { this.sort.bind(this, "quantity") }
                        style = {{
                            flex: 1,
                            justifyContent: "center" 
                        }}
                    >
                        <TextView style = {[
                            textStyle,
                            { 
                                color: activeSort.name === "quantity" ? activeTextColor : "#000"  
                            }
                        ]}>
                            Quantity
                        </TextView>
                    </TouchableOpacity>
                </View>
                <View style = {{
                    flex: 1,
                    flexDirection: "row"
                }}>
                    <TouchableOpacity
                        onPress = {this.sort.bind(this, "price")}
                        style = {{
                            flex: 1,
                            justifyContent: "center" 
                        }}
                    >
                        <TextView style = {[
                            textStyle,
                            { 
                                color: activeSort.name === "price" ? activeTextColor : "#000"  
                            }
                        ]}>
                            Price
                        </TextView>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress = { this.sort.bind(this, "expiry") }
                        style = {{
                            flex: 1,
                            justifyContent: "center" 
                        }}
                    >
                        <TextView style = {[
                            textStyle,
                            { 
                                color: activeSort.name === "expiry" ? activeTextColor : "#000"  
                            }
                        ]}>
                            Expiry
                        </TextView>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    divider = (marginTop = 0) => {
        return (
            <View style = {{
                width: "100%",
                height: 1,
                marginTop: marginTop,
                backgroundColor: "#f2f6f8"
            }}>

            </View>
        )
    }

    renderFilter = () => {
        const textStyle = {
            fontSize: 16
        };

        const activeTextColor = "#1dbd9c";

        const filterButtonStyle = {
            width: "28%",
            height: 60,
            backgroundColor: "#f2f6f8",
            margin: 10,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 8
        }

        return (
            <View style = {{
                marginTop: 20,
                width: "100%",
                flex: 1
            }}>
                <View style = {{
                    width: "100%",
                    height: 30,
                    justifyContent: "center"
                }}>
                    <TextView style = {{
                        fontSize: 12,
                        color: "#848484"
                    }}>
                        Filters
                    </TextView>
                </View>
                {/* Quantity */}
                <View style = {{
                    marginTop: 10,
                    height: 120,
                    flexDirection: "row"
                }}>
                    <View 
                        style = {{
                            flex: 1,
                        }}
                    >
                        <TextView style = {[textStyle, { marginLeft: 10 }]}>
                            Quantity
                        </TextView>
                        <View style = {{
                            width: "100%",
                            marginTop: 10,
                            flex: 1,
                            flexDirection: "row"
                        }}>
                            <TouchableOpacity style = {filterButtonStyle}>
                                <TextView>
                                    > Threshold
                                </TextView>
                            </TouchableOpacity>

                            <TouchableOpacity style = {filterButtonStyle}>
                                <TextView>
                                    {"<"} Threshold
                                </TextView>
                            </TouchableOpacity>

                            <TouchableOpacity style = {filterButtonStyle}>
                                <TextView>
                                    ∞
                                </TextView>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Expiry */}
                <View style = {{
                    marginTop: 10,
                    height: 120,
                    flexDirection: "row"
                }}>
                    <View 
                        style = {{
                            flex: 1,
                        }}
                    >
                        <TextView style = {[textStyle, { marginLeft: 10 }]}>
                            Expiry
                        </TextView>
                        <View style = {{
                            width: "100%",
                            marginTop: 10,
                            flex: 1,
                            flexDirection: "row"
                        }}>
                            <TouchableOpacity style = {filterButtonStyle}>
                                <TextView>
                                    This Month
                                </TextView>
                            </TouchableOpacity>

                            <TouchableOpacity style = {filterButtonStyle}>
                                <TextView>
                                    Next Month
                                </TextView>
                            </TouchableOpacity>

                            <TouchableOpacity style = {filterButtonStyle}>
                                <TextView>
                                    Custom
                                </TextView>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Available Units */}
                <View style = {{
                    marginTop: 10,
                    minHeight: 60,
                    flexDirection: "row",
                }}>
                    <View 
                        style = {{
                            flex: 1,
                        }}
                    >
                        <TextView style = {[textStyle, { marginLeft: 10 }]}>
                            Units
                        </TextView>
                        <View style = {{
                            width: "100%",
                            marginTop: 10,
                            flex: 1,
                        }}>
                            {/* tags */}
                            <View style = {{
                                flex: 1,
                                flexDirection: "row",
                                flexWrap: "wrap"
                            }}>
                                {/* <View style = {{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    borderColor: activeTextColor,
                                    borderWidth: 1,
                                    height: 30,
                                    borderRadius: 100,
                                    paddingLeft: 10,
                                    paddingRight: 10,
                                    marginLeft: 10,
                                    marginTop: 6,
                                }}>
                                    <TouchableOpacity style = {{
                                        width: 20,
                                        height: 20
                                    }}>
                                        <TextView style = {{ color: activeTextColor }}>
                                        x
                                        </TextView>
                                    </TouchableOpacity>
                                    <TextView style = {{ color: activeTextColor }}>Tablet</TextView>
                                </View> */}
                            </View>

                            {/* select unit */}
                            <TouchableOpacity 
                                style = {{
                                    width: 80,
                                    height: 24,
                                    marginLeft: 10,
                                    marginTop: 18,
                                    backgroundColor: "#d33c6b",
                                    borderRadius: 50,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    alignSelf: "center"
                                }}

                                onPress = { this.selectUnit }
                            >
                                <TextView style = {{
                                    color: "#fff",
                                    fontWeight: "bold"
                                }}>
                                    Select
                                </TextView>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                {/* Manufacturers */}
                <View style = {{
                    marginTop: 30,
                    minHeight: 60,
                    flexDirection: "row",
                }}>
                    <View 
                        style = {{
                            flex: 1,
                        }}
                    >
                        <TextView style = {[textStyle, { marginLeft: 10 }]}>
                            Manufacturers
                        </TextView>
                        <View style = {{
                            width: "100%",
                            marginTop: 10,
                            flex: 1,
                        }}>
                            {/* tags */}
                            <View style = {{
                                flex: 1,
                                flexDirection: "row",
                                flexWrap: "wrap"
                            }}>
                                {/* <View style = {{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    borderColor: activeTextColor,
                                    borderWidth: 1,
                                    height: 30,
                                    borderRadius: 100,
                                    paddingLeft: 10,
                                    paddingRight: 10,
                                    marginLeft: 10,
                                    marginTop: 6
                                }}>
                                    <TouchableOpacity style = {{
                                        width: 20,
                                        height: 20
                                    }}>
                                        <TextView style = {{ color: activeTextColor }}>
                                        x
                                        </TextView>
                                    </TouchableOpacity>
                                    <TextView style = {{ color: activeTextColor }}>ROYAL CANIN</TextView>
                                </View> */}
                            </View>

                            {/* select unit */}
                            <TouchableOpacity 
                                style = {{
                                    width: 80,
                                    height: 24,
                                    marginLeft: 10,
                                    marginTop: 18,
                                    backgroundColor: "#d33c6b",
                                    borderRadius: 50,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    alignSelf: "center"
                                }}
                                onPress = { this.selectManufacturer }
                            >
                                <TextView style = {{
                                    color: "#fff",
                                    fontWeight: "bold"
                                }}>
                                    Select
                                </TextView>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    renderApplyButton = () => {
        return (
            <View style = {{
                height: 60,
                alignItems: "center",
                justifyContent: "center"
            }}>
                <TouchableOpacity
                    onPress = {() => this.props.applyFilter()} 
                    style = {{
                        width: "80%",
                        height: 50,
                        backgroundColor: "#1dbd9c",
                        borderRadius: 50,
                        justifyContent: "center",
                        alignItems: "center",
                        alignSelf: "center"
                    }}>
                    <TextView style = {{ color: "#fff"}}>
                        Apply
                    </TextView>
                </TouchableOpacity>
            </View>
        )
    }

    render () {
        return (
            <SafeAreaView style = {{
                flex: 1,
            }}>
                <ScrollView contentContainerStyle = {{ padding: 20 }}>
                    <View style = {{ flex: 1 }}>
                        {/* sorting */}
                        {this.renderSorting()}
                        {this.divider(10)}
                        {/* filter */}
                        {this.renderFilter()}
                    </View>
                </ScrollView>
                {this.renderApplyButton()}

                {/* Unit modal */}
                <Modal
                    visible={this.state.unitSelectorModal}
                    animationType="none"
                    onRequestClose={() => {
                        this.selectUnit();
                    }}
                >
                    <View style = {{
                        width: "100%",
                        height: "100%",
                        backgroundColor: "#fff"
                    }}>
                        {/* Filter nav */}
                        <View style = {{
                            width: "100%",
                            height: 48,
                            flexDirection: "row",
                            alignItems: "center"
                        }}>
                            <TouchableOpacity 
                                style = {{
                                    width: 50,
                                    height: 40,
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                                onPress = { this.selectUnit }
                            >
                                <Ionicons name="md-arrow-back" size={24} color={"#000"} />
                            </TouchableOpacity>
                            <TextView style = {{
                                fontSize: 16,
                                marginLeft: 6
                            }}>
                                Select Unit
                            </TextView>
                        </View>

                        <UnitSelector />
                    </View>
                </Modal>

                {/* Unit Manufacturer */}
                <Modal
                    visible={this.state.manufacturerSelectorModal}
                    animationType="none"
                    onRequestClose={() => {
                        this.selectManufacturer();
                    }}
                >
                    <View style = {{
                        width: "100%",
                        height: "100%",
                        backgroundColor: "#fff"
                    }}>
                        {/* Filter nav */}
                        <View style = {{
                            width: "100%",
                            height: 48,
                            flexDirection: "row",
                            alignItems: "center"
                        }}>
                            <TouchableOpacity 
                                style = {{
                                    width: 50,
                                    height: 40,
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                                onPress = { this.selectManufacturer }
                            >
                                <Ionicons name="md-arrow-back" size={24} color={"#000"} />
                            </TouchableOpacity>
                            <TextView style = {{
                                fontSize: 16,
                                marginLeft: 6
                            }}>
                                Select Manufacturer
                            </TextView>
                        </View>

                        <ManufacturerSelector />
                    </View>
                </Modal>
            </SafeAreaView>
        )
    }
}