import React from "react";
import {
    View,
    SafeAreaView,
    FlatList,
    TextInput,
    Image,
    Modal,
    TouchableOpacity,
    RefreshControl,
    ActivityIndicator,
    StatusBar,
    Dimensions,
    ToastAndroid
} from "react-native";
import TextView from "core/TextView";
import { connect } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

import ProductListItems from "./ProductListItem/index";
import ProductFilters from "./components/ProductFilters";

import styles from "./styles";

const searchIcon = require('./../../../../../assets/images/search.png');

import { getProductList, updateLocalProduct } from "./../../../../actions/productActions";

@connect((store) => {
    return {
        user: store.auth.user,
        productList: store.products.productList,
        deleteProduct: store.products.deleteProduct
    }
})
export default class Products extends React.Component {
    state = {
        rightNavMenuDisplay: false,
        filterModal: false,
        searchKey: null,
        isWaiting:true,
        productList:[],
        pageLoading: false,
        filters: {
            sort: {},
            filter: {}
        },
        activeSort: {
            name: null,
            type: null
        },
        pageInfo: {
            page: 1,
            limit: 10
        },
        deletedProduct: null
    }

    componentDidMount = () => {
        const { pageInfo } = this.state;

        this.getProductList(pageInfo, "REPLACE");

        this.props.navigation.setParams({
            openMenu: this.openMenu,
            openFilter: this.openFilter,
            handleSearchInput: this.handleSearchInput,
            onSubmitEditing: this.search
        })

        this.props.navigation.setOptions({
            headerRight: this.rightSideMenu
        })
    }

    rightSideMenu = () => {
        return (
            <View style = {{
                width: Dimensions.get('window').width - 60,
                height: "100%",
                flexDirection: "row",
                justifyContent: "flex-end",
            }}>
                <View style = {{
                    width: Dimensions.get('window').width - 120,
                    height: "100%",
                }}>
                    <View style = {styles.searchInputContainer}>
                        <TextInput
                            style = {styles.searchInput}
                            onChangeText = {this.handleSearchInput}
                            onSubmitEditing = {this.onSubmitEditing}
                            returnKeyType = {"search"}
                            placeholder = "Search products"
                            placeholderTextColor = "#fff"/>
                        <TouchableOpacity
                            onPress = {this.search}
                            style = {styles.searchButton}>
                            <Image source={searchIcon} style={{width:30, resizeMode:'contain'}}/>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* <TouchableOpacity 
                    style = {{
                        width: 38,
                        height: 58,
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                    onPress = {openFilter}
                >
                    <Ionicons name="md-funnel" size={30} color={"#fff"} />
                </TouchableOpacity> */}

                <TouchableOpacity 
                    style = {{
                        width: 60,
                        height: 58,
                        marginTop: -8,
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                    onPress = {this.openMenu}
                >
                    <Ionicons name="add" size={36} color={"#fff"} />
                </TouchableOpacity>
            </View>
        );
    }

    componentDidUpdate = (prevProps) => {
        if (this.props.productList !== prevProps.productList) {
            this.setState({
                productList: this.props.productList,
            })
        }

        if (this.props.deleteProduct !== prevProps.deleteProduct) {
            const { productList, dispatch } = this.props;
            const { deletedProduct } = this.state;

            ToastAndroid.showWithGravity(
                "Product deleted successfully.",
                ToastAndroid.SHORT,
                ToastAndroid.CENTER
            );

            setTimeout(() => {
                dispatch(
                    updateLocalProduct(
                        productList.filter(product => product._id !== deletedProduct)
                    )
                );
            }, 500);
        }
    }

    getProductList = (pageInfo = this.state.pageInfo, opt = "PUSH", filter = {}, q = null) => {
        const { user } = this.props;
        this.props.dispatch(getProductList(user.accessToken, pageInfo, opt, filter, q))
            .then(() => this.setState({
                isWaiting:false,
                pageLoading: false,
                productList:this.props.productList
            }));
    }

    handleSearchInput = (value) => {
        this.setState({
            searchKey: value.length === 0 ? null : value,
            isWaiting: true,
            pageLoading: false,
            pageInfo: {
                page: 1,
                limit: 10
            }
        }, () => {
            const {
                pageInfo
            } = this.state;
            this.getProductList(pageInfo, "REPLACE", {}, value);
        })
    }

    openMenu = () => {
        this.setState({
            rightNavMenuDisplay: !this.state.rightNavMenuDisplay
        })
    }

    openFilter = () => {
        this.setState({
            filterModal: !this.state.filterModal
        })
    }

    addStock = () => {
        this.setState({
            rightNavMenuDisplay: false
        }, () => {
            const { navigation } = this.props;
            navigation.navigate("AddStock");
        })
    }

    addProduct = () => {
        this.setState({
            rightNavMenuDisplay: false
        }, () => {
            const { navigation } = this.props;
            navigation.navigate("AddProductNew");
        })
    }

    addUnits = () => {
        this.setState({
            rightNavMenuDisplay: false
        }, () => {
            const { navigation } = this.props;
            navigation.navigate("AddUnits");
        })
    }

    bulkAddProduct = () => {
        this.setState({
            rightNavMenuDisplay: false
        }, () => {
            const { navigation } = this.props;
            navigation.navigate("BulkUpload");
        })
    }

    sort = (sortObj) => {
        const { filters } = this.state;
        const newSort = {};
        newSort[sortObj.name] = sortObj.type === "asc" ? 1 : -1
        filters.sort = {
            ...newSort
        };
        
        this.setState({ filters, activeSort: sortObj });
    }

    filter = (filterObj) => {
        const { filters } = this.state;
        filters.filter = {
            ...filterObj
        }

        this.setState({ filters });
    }

    applyFilter = () => {
        const { filters, pageInfo } = this.state;

        this.setState({
            filterModal: false
        }, () => this.getProductList(pageInfo, "REPLACE", filters))
    }

    onRefresh = () => {
        const pageInfo = {
            page: 1,
            limit: 10
        };

        this.setState({
            pageInfo,
            searchKey: null
        }, () => {
            this.getProductList(pageInfo, "REPLACE");
        });
    }

    setModalVisible(visible) {
        this.setState({
            rightNavMenuDisplay: visible,
        })
    }

    deletedProduct = (product) => {
        this.setState({
            deletedProduct: product
        })
    }

    render() {
        const { productList, isWaiting, searchKey } = this.state;
        return (
            <SafeAreaView style = {styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="#1CBD9C" translucent = {false } />
                {
                    productList.length === 0 ? (
                        <View style = {{flex: 1, justifyContent: "center", alignItems: "center"}}>
                            <View 
                                style = {{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    backgroundColor: "#ECF0F1",
                                    borderRadius: 8,
                                    padding: 20
                                }}>
                                <TextView style={{ fontSize: 20, textAlign: "center" }}>
                                    Please login to
                                </TextView>
                                <TextView style={{ fontSize: 20, textAlign: "center" }}>
                                    https://www.khatamanager.com
                                </TextView>
                                <TextView style={{ fontSize: 20, textAlign: "center" }}>
                                    to upload your products in bulk.
                                </TextView>
                                <TextView style={{ fontSize: 20, marginTop: 30, textAlign: "center" }}>
                                    Or
                                </TextView>
                                <TextView style={{ fontSize: 20, marginTop: 30, textAlign: "center" }}>
                                    You can also tap `+` button
                                </TextView>
                                <TextView style={{ fontSize: 20, textAlign: "center" }}>
                                    on top right corner.
                                </TextView>
                            </View>
                        </View>
                    ): (
                        <FlatList
                            refreshControl={
                                <RefreshControl
                                    refreshing={isWaiting}
                                    onRefresh={() => this.onRefresh()}
                                    tintColor={'grey'}
                                />
                            }
                            data = {productList}
                            renderItem = {({item}) => {
                                return <ProductListItems 
                                            data = {item}
                                            user = { this.props.user }
                                            dispatch = { this.props.dispatch }
                                            deletedProduct = { this.deletedProduct }
                                            navigation = {this.props.navigation}
                                        />
                            }}
                            keyExtractor = {item => item.pid}
                            onEndReachedThreshold = {0.5}
                            onEndReached = {() => {
                                const { pageInfo, pageLoading } = this.state;
                                if (pageLoading || productList.length < 10) {
                                    return;
                                }
        
                                this.setState({
                                    pageLoading: true,
                                    pageInfo: {
                                        ...pageInfo,
                                        page: pageInfo.page + 1
                                    }
                                }, () => {
                                    const {
                                        pageInfo,
                                        searchKey
                                    } = this.state;
                                    this.getProductList(pageInfo, "PUSH", {}, searchKey);
                                })
                            }}
                            scrollEventThrottle = {600}
                            ListFooterComponent = {() => {
                                const { pageLoading } = this.state;
                                if (!pageLoading) return null;
                            
                                return <ActivityIndicator style={{ color: "#000" }} size = "large"/>;
                            }}
                        />
                    )
                }

                {/* Filter modal */}
                <Modal
                    animationType="slide"
                    visible={this.state.filterModal}
                    onRequestClose={() => {
                        // toggles filter
                        this.openFilter();
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
                                onPress = { this.openFilter }
                            >
                                <Ionicons name="md-arrow-back" size={24} color={"#000"} />
                            </TouchableOpacity>
                            <TextView style = {{
                                fontSize: 16,
                                marginLeft: 6
                            }}>
                                Filters
                            </TextView>
                        </View>

                        <ProductFilters
                            activeSort = {this.state.activeSort}
                            sort = { this.sort }
                            filter = { this.filter }
                            applyFilter = { this.applyFilter }
                        />
                    </View>
                </Modal>

                {/* for add product and stock dropdown */}
                <Modal
                    transparent={true}
                    visible={this.state.rightNavMenuDisplay}
                    animationType="none"
                    onRequestClose={() => {this.setModalVisible(false)}}
                >
                    <TouchableOpacity style = {{ flex:1, backgroundColor: "transparent"}} onPress = {this.openMenu}>
                        <View style = {{
                            width: 200,
                            elevation: 4,
                            // height: 128,
                            backgroundColor: "#fff",
                            alignSelf: "flex-end",
                            justifyContent: "flex-start",
                            marginRight: 12,
                            marginTop: 80,
                            borderRadius: 8,
                        }}>
                            <TouchableOpacity 
                                onPress = {this.addStock}
                                style = {{
                                    width: 240,
                                    height: 60,
                                    justifyContent: "center",
                                    paddingLeft: 24,
                                    backgroundColor:'transparent'
                                }}
                            >
                                <TextView style = {{
                                    fontSize: 16,
                                    fontWeight: "bold"
                                }}>
                                    Add Stock
                                </TextView>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                onPress = {this.addProduct}
                                style = {{
                                    width: 240,
                                    height: 60,
                                    justifyContent: "center",
                                    paddingLeft: 24,
                                    backgroundColor:'transparent'
                                }}
                            >
                                <TextView style = {{
                                    fontSize: 16,
                                    fontWeight: "bold"
                                }}>
                                    Add Product
                                </TextView>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                onPress = {this.addUnits}
                                style = {{
                                    width: 240,
                                    height: 60,
                                    justifyContent: "center",
                                    paddingLeft: 24,
                                    backgroundColor:'transparent'
                                }}
                            >
                                <TextView style = {{
                                    fontSize: 16,
                                    fontWeight: "bold"
                                }}>
                                    Add/Update Units
                                </TextView>
                            </TouchableOpacity>
                            {/* <TouchableOpacity 
                                onPress = {this.bulkAddProduct}
                                style = {{
                                    width: 240,
                                    height: 60,
                                    justifyContent: "center",
                                    paddingLeft: 24,
                                    backgroundColor:'transparent'
                                }}
                            >
                                <TextView style = {{
                                    fontSize: 16,
                                    fontWeight: "bold"
                                }}>
                                    Bulk Upload Product
                                </TextView>
                            </TouchableOpacity> */}
                        </View>
                    </TouchableOpacity>
                </Modal>
            </SafeAreaView>
        )
    }
}