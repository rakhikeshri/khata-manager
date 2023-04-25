import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    wrapper: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        flexDirection: 'column',
        marginBottom:100
    },
    input: {
        width: 340,
        height: 45,
        borderWidth: 1,
        borderColor:'#d6dade',
        paddingLeft:28,
        borderRadius:44,
        fontSize:16,
        textAlignVertical:'center'
    },
    inputLabel: {
        color: "#fff",
        fontSize: 16
    },
    loginButton: {
        marginTop:20,
        backgroundColor: "#1abc9c",
        width:340,
        borderRadius:24,
        height: 46,
        alignItems: "center",
        justifyContent: "center",
    },
    loginButtonText: {
        color: "#fff",
        fontSize: 18,
        width: 50,
        fontWeight: "bold"
    },
    registerLink: {
        marginTop:20,
        borderColor: "#1abc9c",
        borderWidth: 1,
        width:340,
        borderRadius:24,
        height: 46,
        alignItems: "center",
        justifyContent: "center",
    }
})
