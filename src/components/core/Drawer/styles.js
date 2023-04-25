import { StyleSheet } from "react-native";

export default StyleSheet.create({
    header: {
        backgroundColor: "#2f7eb9",
        height: 120,
        flexDirection: "row"
    },
    headerWrapper: {
        width: "100%",
        justifyContent: "flex-end",
        padding: 16,
    },
    userNameText: {
        fontSize: 20,
        fontWeight: "700",
        color: "#e4e4e4"
    },
    shopNameText: {
        color: "#e4e4e4"   
    },
    menuWrapper: {
        marginTop: 10,
        width: "100%",
        height: "100%",
    },
    menuItemWrapper: {
        flexDirection: "row",
        paddingLeft: 10,
        height: 50,
        alignItems: "center"
    },
    menuIcon: {
        width: 30,
        height: 30
    },
    menuItemText: {
        fontSize: 20,
        marginLeft: 8,
    }
})
