import React from "react";
import { connect } from "react-redux";
import { 
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Image,
    SectionList,
    View
} from "react-native";

import TextView from "core/TextView";

import styles from "./styles";

import rightArrow from "./../../../../../assets/images/rightArrow.png";

@connect((store) => {
  return {
    user: store.auth.user,
    scanned: store.orders.scanned,
    reports: store.report.reports
  }
})
export default class Help extends React.Component {

    state = {
        topics: [
            {
                title: "Invoices",
                data: [
                    {
                        topic: "How to create an invoice?",
                        id: "4c5jn7p6pnw"
                    },
                    // {
                    //     topic: "How to create an invoice with Custom Product?",
                    //     id: "4c5jn7p6pnw"
                    // },
                    // {
                    //     topic: "How to create an invoice with different units?",
                    //     id: "4c5jn7p6pnw"
                    // },
                    {
                        topic: "How to create an invoice with partial payment?",
                        id: "tzOJaoL3fOY"
                    },
                    {
                        topic: "How to create a pre/post dated invoice?",
                        id: "POe0EhMa_1w"
                    },
                    {
                        topic: "How to print an A4 invoice?",
                        id: "Xk68iaNt_BM"
                    },
                    {
                        topic: "How to print an POS invoice?",
                        id: "8-A7p9Re5BI"
                    },
                    {
                        topic: "How to settle partial paid invoice?",
                        id: "EzyelX2qUHc"
                    },
                    {
                        topic: "How to resend invoice sms to customer?",
                        id: "KxmpOdYwkZ4"
                    },
                    {
                        topic: "How to delete an invoice?",
                        id: "FcmQC3WMxoY"
                    }
                ]
            },
            {
                title: "Products",
                data: [
                    {
                        topic: "How to add product stocks in bulk?",
                        id: "Eo9h-MFhUO0"
                    },
                    {
                        topic: "How to add single product?",
                        id: "NEZueQ95O5k"
                    },
                    {
                        topic: "How to edit single product?",
                        id: "KDOfNKUk5ww"
                    },
                    {
                        topic: "How to add available unit to a product?",
                        id: "KDOfNKUk5ww"
                    },
                    {
                        topic: "How to delete a Product?",
                        id: "Xl_m0HyuvVE"
                    }
                ]
            }
        ]
    }

    navigateToHelp(id) {
        const { navigation } = this.props;
        navigation.navigate("PlayHelpTopic", { id });
    }

    render() {
        const { topics } = this.state;
        return (
            <View contentContainerStyle = {styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="#1CBD9C" translucent = {false } />
                <SectionList
                    sections={topics}
                    keyExtractor={(item, index) => item.id+index}
                    renderItem={({ item }) =>  {
                        return (
                            <TouchableOpacity
                                style = {{
                                    elevation: 2,
                                    backgroundColor: "#fff",
                                    paddingLeft: 20,
                                    paddingTop: 10,
                                    paddingBottom: 10,
                                    marginTop: 10,
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center"
                                }}
                                onPress={this.navigateToHelp.bind(this, item.id)}>
                                <TextView style = {{ flex: 1, fontSize: 14 }}>
                                {
                                    item.topic
                                }
                                </TextView>
                                <Image source={rightArrow} style={{height:26, width: 60, resizeMode:'contain'}}/>
                            </TouchableOpacity>
                        )}
                    }
                    renderSectionHeader={({ section: { title } }) => (
                        <View style = {{ paddingLeft: 20, marginTop: 10, height: 50, backgroundColor: "#f4f6f7", justifyContent: "center"}}>
                            <TextView style={{ fontSize: 18, fontWeight: "bold" }}>{title}</TextView>
                        </View>
                    )}
                />
            </View>
        )
    }
}