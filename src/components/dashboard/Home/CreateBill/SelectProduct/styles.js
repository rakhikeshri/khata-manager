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
        paddingLeft: 2,
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
    radio: {
        justifyContent: 'center',
        alignItems: 'center',
      },
    product: {
        flex: 1,
        backgroundColor: '#f6f8f9',
        borderRadius: 12,
        paddingLeft: 4,
        paddingRight: 4,
        paddingTop: 8,
        paddingBottom: 8,
        marginTop: 10,
        marginLeft: 4,
        marginRight: 4,
        flexDirection: 'row'
    }
})