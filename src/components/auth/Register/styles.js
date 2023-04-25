import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    wrapper: {
        flex: 10,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: 'column',
        marginTop: 40,
        marginBottom:40
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
        width:100,
        borderRadius:4,
        height: 46,
        alignItems: "center",
        justifyContent: "center",
    },
    loginButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold"
    }
})
