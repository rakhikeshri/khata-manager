import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        // alignItems: "center",
        // justifyContent: "center",
    },
    scanContainer: {
        width:160,
        height:40,
        backgroundColor:'blue',
        borderRadius:7,
        padding: 10,
        justifyContent: "center",
    },
    scanBarText:{
        fontSize:20,
        color:'#fff',
        fontWeight:'bold'
    },
    inputWrapper: {
        backgroundColor: "#ffffff",
        borderRadius: 8,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#d6dade",
        width: 320,
        height: 50,
        fontSize: 22,
        paddingLeft: 20,
        marginBottom: 20
    },
    helperTextContainer: {
        width: 300,
        marginTop: 24,
        marginBottom: 40,
        justifyContent:'flex-start'
    },
    helperText: {
        fontWeight: "500",
        fontSize: 16,
        color: "#848484",
        textAlign: "center"
    },
})