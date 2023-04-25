import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: 14,
        paddingLeft: 14,
        paddingRight: 14
    },
    searchInputContainer: {
        height: 38,
        marginTop: 4,
        marginBottom: 10,
        marginRight: 10,
        flexDirection: "row",
        backgroundColor: "#19aa8c",
        borderRadius: 4,
        paddingLeft: 12,
    },
    searchInput: {
        color: "#fff",
        flex: 1,
        borderTopLeftRadius: 24,
        borderBottomLeftRadius: 24,
        paddingRight: 16,
        fontSize: 16
    },
    searchButton: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 5,
        marginRight: 5,
        width: 34,
        height: 34,
    }
})
