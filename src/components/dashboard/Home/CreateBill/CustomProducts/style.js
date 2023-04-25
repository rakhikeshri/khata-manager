import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        marginTop: 10
    },
    formWrapper: {
        backgroundColor: "#fff"
    },
    formFooter: {
        width: "100%",
        height: 80,
        flexDirection: "row"
    },
    doneButton: {
        flex: 1,
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#20be9c"
    },
    addMoreButton: {
        flex: 1,
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#2f7eb9",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
        width: 100,
        textAlign: "center"
    },
    buttonHelperText: {
       fontSize: 12,
       color: "#fff"
    },
    formRowWrapper: {
        width: "100%",
        height: 100,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 14
    },
    formText: {
        fontSize: 18,
        fontWeight: "500",
        marginLeft: 2
    },
    formInputStyle: {
        marginTop: 12,
        width: "100%",
        height: 50,
        borderWidth: 1,
        borderRadius: 12,
        borderColor: "#dedede",
        paddingLeft: 16,
        paddingRight: 16,
        fontSize: 16
    },
    formWrapperColumn: {
        width: "100%",
        height: 100,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 14,
        flex: 1
    }
})