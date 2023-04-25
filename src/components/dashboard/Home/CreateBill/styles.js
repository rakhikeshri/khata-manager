import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    helperTextContainer: {
        justifyContent: "center",
        textAlign: "center",
        width: 300,
        margin: 50
    },
    helperText: {
        fontWeight: "500",
        fontSize: 16,
        color: "#848484",
        textAlign: "center"
    },
    formController:{
        alignItems:'center',
        justifyContent:'center'
    },
    scanContainer: {
        width:182,
        height:50,
        marginTop: 50,
        backgroundColor:"#20be9c",
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
    },
    scanBarText:{
        fontSize: 14,
        color: "#fff",
        fontWeight: "bold",
        width: 118,
        textAlign: "center"
    },
    inputWrapper: {
        backgroundColor: "#ffffff",
        borderRadius: 25,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#d6dade",
        width: 320,
        height: 50,
        fontSize: 22,
        paddingLeft: 20,
        paddingRight: 20,
        marginBottom: 20
    }
})