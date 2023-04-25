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
        marginTop:10,
    },
    product:{
        flex:1,
        backgroundColor: '#f6f8f9',
        borderRadius: 8,
        marginTop:7,
        marginBottom: 7,
        marginLeft:10,
        marginRight:5,
        paddingLeft:4,
        paddingRight: 4,
        paddingTop: 8,
        paddingBottom: 8,
        elevation: 3
    }
})
