
//////// Not User, Will have to remove /////////////

import React from "react";
import {
    TouchableOpacity,
    Image,
    View,
    Text,
    Dimensions
} from "react-native";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createDrawerNavigator } from 'react-navigation-drawer';

// screens
import Drawer from "./../components/core/Drawer/index";
import LoadingScreen from "./../components/LoadingScreen/index";
import Login from "./../components/auth/Login/index";
import Register from "./../components/auth/Register/index";
import Home from "./../components/dashboard/Home/index";
// Billing
import CreateBill from "./../components/dashboard/Home/CreateBill/index";
import Scanner from "./../components/dashboard/Home/CreateBill/Scanner/index";
import CustomProducts from "./../components/dashboard/Home/CreateBill/CustomProducts/index";
import SelectProduct from "./../components/dashboard/Home/CreateBill/SelectProduct/index";
import PaymentMethod from "./../components/dashboard/Home/CreateBill/PaymentMethod/index";
import Checkout from "../components/dashboard/Home/CreateBill/checkout/index";
import Success from "../components/dashboard/Home/CreateBill/CompletedOrder/index";
import ManualBilling from "../components/dashboard/Home/CreateBill/ManualBilling/index";
// Orders
import Orders from "./../components/dashboard/Home/Orders/index";
import OrderDetails from "./../components/dashboard/Home/Orders/OrderDetails/index";
// Products
import Products from "./../components/dashboard/Home/Products/index";
import ProductDetail from "./../components/dashboard/Home/Products/ProductDetails/index";
import AddStock from "./../components/dashboard/Home/Products/AddStock/index";
import AddProduct from "./../components/dashboard/Home/Products/AddProduct/index";
import BulkUpload from "./../components/dashboard/Home/Products/BulkUpload/index";
// Customers
import Customers from "./../components/dashboard/Home/Customers/index";
import AddCustomer from "./../components/dashboard/Home/Customers/AddCustomer/index";

//report
import Reports from "./../components/dashboard/Home/Reports/index";
import OutOfStock from "./../components/dashboard/Home/Reports/OutOfStock/index";
import ExpiredProduct from "./../components/dashboard/Home/Reports/ExpiredProduct/index";
import Settlement from "./../components/dashboard/Home/Reports/Settlement/index";

// Settings
import Settings from "./../components/dashboard/Home/Settings/index";
import InvoiceSettings from "./../components/dashboard/Home/Settings/InvoiceSettings/index";

// Help
import Help from "./../components/dashboard/Home/Help";
import PlayHelpTopic from "../components/dashboard/Home/Help/PlayHelpTopic";

// Subscriptions
// import Subscription from "./../components/dashboard/Home/Subscription";

const hamburgerIcon = require("./../../assets/images/hamburger_icon.png");

import { getFromLocal } from "./../common/utils";

// const userData = await getFromLocal("ph_user_data");

// console.log(await userData);

// Create Drawer Navigator
const DrawerContainer = createDrawerNavigator(
    {
        Home : Home
    },
    {
        drawerPosition: "left",
        drawerType:"slide",
        contentComponent: ({ navigation }) => {
            return <Drawer navigation = { navigation }/>
        },
        navigationOptions: ({navigation}) => ({
            headerTitle:"Home",
            drawerIcon: null,
            headerTitleStyle: {
                width: "100%",
            },
            headerBackTitle:null,
            headerLeft: (
                <TouchableOpacity onPress = {() => { navigation.toggleDrawer() }}>
                    <Image 
                        source={hamburgerIcon}
                        style={{marginLeft: 16, width:30, height:30, resizeMode:"contain"}}
                    />
                </TouchableOpacity>
            ),
            headerStyle: {
                backgroundColor:"#1dbd9c",
            },
            headerTintColor: '#fff',
        })
    }
)

const loginRoutes = {
    Login: {
        screen: Login,
        navigationOptions: {
            header: null,
        }
    },
    Register: {
        screen: Register,
        navigationOptions: {
            header: null,
        }
    }
}

const securedRoutes = {
    LoadingScreen: {
        screen: LoadingScreen,
        navigationOptions: {
            header: null,
        }
    },
    Dashboard: {
        screen: DrawerContainer
    },
    Reports: {
        screen: Reports,
        navigationOptions: {
            headerTitle: 'Report',
            headerStyle: {
                backgroundColor: '#1CBD9C',
            },
            headerTitleStyle:{
                color:'#fff',
                fontWeight:'bold',
                width : Dimensions.get('window').width
            },
            headerBackTitle:null,
            headerTintColor: '#fff'
        }
    },
    Settlement: {
        screen: Settlement,
        navigationOptions: {
            headerTitle: 'Settlement Report',
            headerStyle: {
                backgroundColor: '#1CBD9C',
            },
            headerTitleStyle:{
                color:'#fff',
                fontWeight:'bold',
                width : Dimensions.get('window').width
            },
            headerBackTitle:null,
            headerTintColor: '#fff'
        }
    },
    Settings: {
        screen: Settings,
        navigationOptions: {
            headerTitle: 'Settings',
            headerStyle: {
                backgroundColor: '#1CBD9C',
            },
            headerTitleStyle:{
                color:'#fff',
                fontWeight:'bold',
                width : Dimensions.get('window').width
            },
            headerBackTitle:null,
            headerTintColor: '#fff'
        }
    },
    InvoiceSettings: {
        screen: InvoiceSettings,
        navigationOptions: {
            headerTitle: 'Invoice Settings',
            headerStyle: {
                backgroundColor: '#1CBD9C',
            },
            headerTitleStyle:{
                color:'#fff',
                fontWeight:'bold',
                width : Dimensions.get('window').width
            },
            headerBackTitle:null,
            headerTintColor: '#fff'
        }
    },
    OutOfStock: {
        screen: OutOfStock,
        navigationOptions: {
            headerTitle: 'Report',
            headerStyle: {
                backgroundColor: '#1CBD9C',
            },
            headerTitleStyle:{
                color:'#fff',
                fontWeight:'bold',
                width : Dimensions.get('window').width
            },
            headerBackTitle:null,
            headerTintColor: '#fff'
        }
    },
    ExpiredProduct: {
        screen: ExpiredProduct,
        navigationOptions: {
            headerTitle: 'Report',
            headerStyle: {
                backgroundColor: '#1CBD9C',
            },
            headerTitleStyle:{
                color:'#fff',
                fontWeight:'bold',
                width : Dimensions.get('window').width
            },
            headerBackTitle:null,
            headerTintColor: '#fff'
        }
    },
    // Billing
    CreateBill: {
        screen: CreateBill,
        navigationOptions: {
            headerTitle: 'Billing',
            headerStyle: {
                backgroundColor: '#1CBD9C',
            },
            headerTitleStyle:{
                color:'#fff',
                fontWeight:'bold',
                width : Dimensions.get('window').width
            },
            headerBackTitle:null,
            headerTintColor: '#fff'
        }
    },
    // Manual Billing
    ManualBilling: {
        screen: ManualBilling,
        navigationOptions: {
            headerTitle: 'Billing',
            headerStyle: {
                backgroundColor: '#1CBD9C',
            },
            headerTitleStyle:{
                color:'#fff',
                fontWeight:'bold',
                width : Dimensions.get('window').width
            },
            headerBackTitle:null,
            headerTintColor: '#fff'
        }
    },
    CustomProducts: {
        screen: CustomProducts,
        navigationOptions: {
            headerTitle: 'Custom Products',
            headerStyle: {
                backgroundColor: '#1CBD9C',
            },
            headerTitleStyle:{
                color:'#fff',
                fontWeight:'bold',
                width : Dimensions.get('window').width
            },
            headerTintColor: '#fff'
        }
    },
    Scanner: {
        screen: Scanner,
        navigationOptions: {
            header: null,
        }
    },
    SelectProduct: {
        screen: SelectProduct,
        navigationOptions: {
            headerTitle: 'Select Products',
            headerStyle: {
                backgroundColor: '#1CBD9C',
            },
            headerTitleStyle:{
                color:'#fff',
                fontWeight:'bold',
                width : Dimensions.get('window').width
            },
            headerTintColor: '#fff'
        }
    },
    AddCustomer: {
        screen: AddCustomer,
        navigationOptions: {
            headerTitle: 'Add Customer',
            headerStyle: {
                backgroundColor: '#1CBD9C',
            },
            headerTitleStyle:{
                color:'#fff',
                fontWeight:'bold',
                width : Dimensions.get('window').width
            },
            headerTintColor: '#fff'
        }
    },
    PaymentMethod: {
        screen: PaymentMethod,
        navigationOptions: {
            headerTitle: 'Payment Method',
            headerStyle: {
                backgroundColor: '#1CBD9C',
            },
            headerTitleStyle:{
                color:'#fff',
                fontWeight:'bold',
                width : Dimensions.get('window').width
            },
            headerBackTitle:null,
            headerTintColor: '#fff'
        }
    },
    Checkout: {
        screen: Checkout,
        navigationOptions: {
            headerTitle: 'Checkout',
            headerStyle: {
                backgroundColor: '#1CBD9C',
            },
            headerTitleStyle:{
                color:'#fff',
                fontWeight:'bold',
                width : Dimensions.get('window').width
            },
            headerBackTitle:null,
            headerTintColor: '#fff'
        }
    },
    Success: {
        screen: Success,
        navigationOptions: {
            header: null,
        }
    },
    // Orders
    Orders: {
        screen: Orders,
        navigationOptions: {
            headerStyle: {
                backgroundColor: '#1CBD9C',
            },
            headerTitleStyle:{
                color:'#fff',
                fontWeight:'bold',
                width: '100%'
            },
            headerTintColor: '#fff'
        }
    },
    OrderDetails: {
        screen: OrderDetails,
        navigationOptions: {
            headerTitle: 'Order Details',
            headerStyle: {
                backgroundColor: '#1CBD9C',
            },
            headerTitleStyle:{
                color:'#fff',
                fontWeight:'bold',
                width: '100%'
            },
            headerTintColor: '#fff'
        }
    },
    // Products
    Products: {
        screen: Products,
        navigationOptions: {
            // headerTitle: 'Products',
            headerStyle: {
                backgroundColor: '#1CBD9C',
            },
            headerTitleStyle:{
                color:'#fff',
                fontWeight:'bold',
                width: '100%'
            },
            headerBackTitle:null,
            headerTintColor: '#fff'
        }
    },
    ProductDetail: {
        screen: ProductDetail,
        navigationOptions: {
            headerTitle: 'Products',
            headerStyle: {
                backgroundColor: '#1CBD9C',
            },
            headerTitleStyle:{
                color:'#fff',
                fontWeight:'bold',
                width: '100%'
            },
            headerTintColor: '#fff'
        }
    },
    AddStock: {
        screen: AddStock,
        navigationOptions: {
            headerTitle: 'Add Stock',
            headerStyle: {
                backgroundColor: '#1CBD9C',
            },
            headerTitleStyle:{
                color:'#fff',
                fontWeight:'bold',
                width: '100%'
            },
            headerTintColor: '#fff'
        }
    },
    AddProduct: {
        screen: AddProduct,
        navigationOptions: {
            headerTitle: 'Add Product',
            headerStyle: {
                backgroundColor: '#1CBD9C',
            },
            headerTitleStyle:{
                color:'#fff',
                fontWeight:'bold',
                width: '100%'
            },
            headerTintColor: '#fff'
        }
    },
    // experimental feature
    BulkUpload: {
        screen: BulkUpload,
        navigationOptions: {
            headerTitle: 'Bulk Upload',
            headerStyle: {
                backgroundColor: '#1CBD9C',
            },
            headerTitleStyle:{
                color:'#fff',
                fontWeight:'bold',
                width: '100%'
            },
            headerTintColor: '#fff'
        }
    },
    // Customers
    Customers: {
        screen: Customers,
        navigationOptions: {
            // headerTitle: 'Customers',
            headerStyle: {
                backgroundColor: '#1CBD9C',
            },
            headerTitleStyle:{
                color:'#fff',
                fontWeight:'bold',
                width: '100%'
            },
            headerTintColor: '#fff'
        }
    },
    // Help
    Help: {
        screen: Help,
        navigationOptions: {
            headerTitle: 'Help',
            headerStyle: {
                backgroundColor: '#1CBD9C',
            },
            headerTitleStyle:{
                color:'#fff',
                fontWeight:'bold',
                width: '100%'
            },
            headerTintColor: '#fff'
        }
    },
    // PlayHelpTopic
    PlayHelpTopic: {
        screen: PlayHelpTopic,
        navigationOptions: {
            headerTitle: 'Help Topic',
            headerStyle: {
                backgroundColor: '#1CBD9C',
            },
            headerTitleStyle:{
                color:'#fff',
                fontWeight:'bold',
                width: '100%'
            },
            headerTintColor: '#fff'
        }
    }
}

let mainRoutes = {
    ...loginRoutes,
    ...securedRoutes
}

let routeConfigs = {
    initialRouteName: "LoadingScreen",
}

// Create our stack navigator
let AppNavigator = createStackNavigator(
    mainRoutes,
    routeConfigs
);

// And the app container
const Navigation = createAppContainer(AppNavigator);

export default Navigation;
export {
    AppNavigator
}
