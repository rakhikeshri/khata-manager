import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        width: "95%",
        borderRadius: 12,
        backgroundColor: "#f4f6f7",
        margin: 10,
        // height: 110,
        display: "flex",
        flexDirection: "row",
        elevation: 3
    },
    column: {
        flex: 1,
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 8,
        paddingBottom: 8
    },
    rightAlign: {
        alignItems: "flex-end"
    },
    numberOfItems: {
        fontSize: 20,
        fontWeight: "700",
        color: "#242424"
    },
    orderId: {
        fontSize: 12,
        color: "#242424"
    },
    customerGst: {
        fontWeight: "700",
        fontSize: 12,
        color: "#242424"
    },
    customerName: {
        marginTop: 18,
        fontWeight: "700",
        color: "#242424"
    },
    phone: {
        fontSize: 12,
        color: "#242424"
    },
    orderTime: {
        fontSize: 14,
        color: "#2f7eb9"
    },
    totalAmount: {
        marginTop: 2,
        fontSize: 24,
        color: "#242424",
    },
    paymentStatus: {
        marginTop: 2,
        color : "#242424"
    },
    paymentMethod: {
        marginTop: 4,
        color : "#242424"
    }
})
