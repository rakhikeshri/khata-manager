import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        // alignItems: "center",
        marginTop: 10
        // justifyContent: "center",
    },
    scanContainerView: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    scanContainer: {
        width:60,
        height:60,
        backgroundColor:'#30d1ae',
        borderRadius:57,
        justifyContent: "center",
        alignItems:'center'
    },
    scanBarText:{
        fontSize:20,
        color:'#fff',
        fontWeight:'bold'
    },
    scanMoreModalContainer: {
        width: 300,
        height: 100
    },
    product: {
        flex: 1,
        backgroundColor: '#f6f8f9',
        borderRadius: 12,
        padding: 4,
        marginTop: 10,
        marginLeft: 4,
        marginRight: 4,
        flexDirection: 'row'
    }
})