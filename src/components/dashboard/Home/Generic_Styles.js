import { StyleSheet, StatusBar, Platform } from 'react-native';

export const customStyles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        padding: 20,
        position:"relative",
    },
    genericList: {
        padding: 15,
        backgroundColor: "#EDF2F3",
    },
    centerView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    draft_complete_box: {
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 2,
        textAlign: 'center'
    },
    genericBtn: {
        padding: 13,
        alignItems: 'center',
        borderRadius: 8
    },
    genericBtnText: {
        fontWeight: 700,
    },
    genericTransparentModal: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 30,
        backgroundColor: '#000000aa'
    },
    genericModalBox: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8
    },
    genericModalBtn: {
        paddingVertical: 12,
        width: "50%",
        alignItems: "center",
    },
    genericModalBtnText: {
        fontSize: 14,
        fontWeight: 700
    },
    inputBox: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 8,
        borderRadius: 4,
        height: 28,
        minWidth: 63,
        borderColor: "#BDC6C8",
    },
});