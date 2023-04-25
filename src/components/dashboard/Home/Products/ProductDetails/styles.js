import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    inputContainer : {
        width:'100%',
    },
    searchInput:{
        width:'95%',
        backgroundColor: '#ffffff',
        borderRadius: 25,
        margin:10,
        padding:10,
        borderColor: '#d6dade',
        borderWidth:1,
        overflow: 'hidden'
    },
    productContainer:{
        flex:1,
        marginTop:10
    },
    product:{
        width:'95%',
        backgroundColor: '#f4f6f7',
        borderRadius: 12,
        overflow: 'hidden',
        margin:10,
        padding:10,
        flex:1,
        flexDirection:'column'
    },
    priceContainer:{
        width:'95%',
        backgroundColor: '#f4f6f7',
        borderRadius: 12,
        overflow: 'hidden',
        margin:10,
        padding:10,
        flex:.5,
        flexDirection:'column'
    },
    descriptionContainer:{
        width:'95%',
        backgroundColor: '#f4f6f7',
        borderRadius: 12,
        overflow: 'hidden',
        margin:10,
        padding:10,
        flex:1,
        flexDirection:'column'
    },
    detailContainer:{
        width:'95%',
        backgroundColor: '#f4f6f7',
        borderRadius: 12,
        overflow: 'hidden',
        margin:10,
        padding:10,
        flex:1,
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
    }
})
