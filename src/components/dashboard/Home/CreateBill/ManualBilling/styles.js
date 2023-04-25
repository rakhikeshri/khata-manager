import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    productFlatListContainer: {
        flex: 1,
        backgroundColor: "#fff",
        paddingLeft: 14,
        paddingRight: 14
    },
    searchContainer: {
        backgroundColor: "#1CBD9C"
    },
    searchInputContainer: {
        borderWidth: 0,
        borderRadius: 4,
        height: 48,
        marginLeft: 12,
        marginRight: 12,
        marginTop: 10,
        backgroundColor: "#19ac8e",
        marginBottom: 10,
        flexDirection: "row"
    },
    searchInput: {
        flex: 1,
        paddingLeft: 16,
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 4,
        paddingRight: 16
    },
    searchButton: {
        alignItems: "center",
        justifyContent: "center",
        width: 48,
        height: 44,
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4,
        backgroundColor: "#19ac8e"
    },
    productContainer: {
        flex: 1,
        marginTop: 10,
    },
    scannerContainer: {
        flex: 1,
        alignItems: 'center'
    },
    scanMoreModalContainer: {
        width: 300,
        height: 230,
    },
    product: {
        flex: 4,
        backgroundColor: '#f6f8f9',
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
        padding: 4,
        marginTop: 10,
        marginLeft: 4,
        marginRight: 4,
        flexDirection: 'row'
    }
})
