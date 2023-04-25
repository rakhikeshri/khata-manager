import { StyleSheet } from "react-native";

export default StyleSheet.create({
    menuContainer: {
        width: "100%",
        height: 60,
        padding: 16
    },
    menuWrapper: {
        justifyContent: "center",
        flexDirection: "row"
    },
    menuLabelContainer: {
        flex: 1
    },
    menuLabel: {
        fontSize: 18,
    },
    dividerStyle: {
        borderBottomWidth: 1,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderBottomColor: "#D4D4D4"
    },
    iconContainer: {
        width: 50,
        justifyContent: "center",
        alignItems: "center",
        height: "100%"
    }
})
