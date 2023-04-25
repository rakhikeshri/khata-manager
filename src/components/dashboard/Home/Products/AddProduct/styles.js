import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1
    },
    formWrapper: {
        flex: 1,
        padding: 24,
    },
    footerWrapper: {
        height: 100,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        backgroundColor: "#f6f8f9"
    },
    inputStyle: {
        flex: 1,
        height: 44,
        borderWidth: 1,
        borderRadius: 8,
        padding: 8,
        borderColor: "#dedede",
        flexDirection: "row",
        alignItems: "center"
    },
    buttonContainer: {
        width: "80%",
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#d33b6b",
        borderRadius: 8
    }
})
