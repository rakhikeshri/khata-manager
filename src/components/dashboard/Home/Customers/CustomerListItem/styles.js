import { StyleSheet } from "react-native";

export default StyleSheet.create({
    ItemWrapper: {
        // height: 120,
        backgroundColor: "#f4f6f7",
        marginTop: 14,
        borderRadius: 12,
        padding: 12,
        elevation: 2
    },
    customerInfoRow: {
        flex: 2,
        flexDirection: "row"
    },
    dataColumn: {
        flex: 1,
    },
    customerNameText: {
        fontSize: 18,
        fontWeight: "700",
        color: "#242424"
    },
    customerPhoneText: {
        marginTop: 6,
        fontSize: 12,
        textDecorationLine: "underline",
        color : "#317db9"
    },
    customerType: {
        marginTop: 16,
        fontSize: 12,
        fontWeight: "bold",
        color: "#e67e22"
    },
    iconColumn: {
        width: 70,
        height: "100%",
        alignItems: "flex-end"
    },
    customerAddressRow: {
        flex: 1,
        marginTop: 16
    },
    addressText: {
        fontSize: 12,
        color : "#242424"
    }
})
