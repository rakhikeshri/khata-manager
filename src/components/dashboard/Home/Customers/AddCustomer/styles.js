import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: 14,
    },
    formFieldWrapper: {
        height: 76,
        marginTop: 14
    },
    label: {
        fontSize: 14,
        fontWeight: "500",
        marginLeft: 2
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 8,
        padding: 14,
        borderColor: "#dedede",
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10
    },
    footerButtonWrapper: {
        height: 70,
        backgroundColor: "#f4f6f7",
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: 20,
        paddingRight: 20
    },
    buttonStyle: {
        width: "70%",
        height: 56,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#d33c6b",
        borderRadius: 100
    },
    buttonTextStyle: {
        fontWeight: "bold",
        fontSize: 18,
        color: "#fff"
    }
})
