import { StyleSheet } from "react-native";

export default StyleSheet.create({
    searchInputContainer: {
        borderWidth: 2,
        borderRadius: 28,
        height: 48,
        marginLeft: 12,
        marginRight: 12,
        marginTop:10,
        borderColor: "#d6dade",
        marginBottom: 10,
        flexDirection: "row",
    },
    searchInput: {
        flex: 1,
        paddingLeft: 16,
        borderTopLeftRadius: 24,
        borderBottomLeftRadius: 24,
        paddingRight: 16
    },
    searchButton: {
        alignItems: "center",
        justifyContent: "center",
        width: 48,
        height: 44,
        borderTopRightRadius: 24,
        borderBottomRightRadius: 24,
        backgroundColor: "#f4f6f7"
    }
})
