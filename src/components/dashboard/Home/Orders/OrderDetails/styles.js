import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: 14,
        flexDirection: "column"
    },
    successIconContainer: {
        width: "100%",
        height: "20%",
        alignItems: "center",
        justifyContent: "center"
    },
    successIconWrapper: {
        width: 60,
        height: 60,
        backgroundColor: "#76c862",
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center"
    },
    successIcon: {
        width: 40,
        height: 40
    },
    dataTable: {
        flex:3,
        alignContent:'flex-start',
        marginLeft:15,
        marginRight:10,
        marginTop:15
    },
    dataRow: {
        flex: 1,
        flexDirection: "row",
        alignItems:'flex-start'
    },
    dataCell: {
        flex: 1,
        justifyContent: "center",
    },
    dataTableHeaderText: {
        fontSize: 14,
        color : "#242424",
    },
    dataTableDataText: {
        fontSize: 14,
        fontWeight: "bold",
        color : "#242424",
    },
    actionWrapper: {
        height: 90,
        width: "100%",
        backgroundColor: "#f4f6f7",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    button: {
        width: 70,
        height: 70,
        paddingVertical:15,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center"
    },
    buttonText: {
        color : "#fff",
        width: 100,
        textAlign: "center",
        fontWeight: "bold"
    }
})
