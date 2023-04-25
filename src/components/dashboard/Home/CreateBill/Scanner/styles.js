import { StyleSheet, Dimensions } from "react-native";
const { width } = Dimensions.get('window')
const qrSize = width * 0.9
export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scannerContainer: {
    flex: 1,
    alignItems: 'center'
  },
  scanMoreModalContainer: {
    width: 300,
    height: 200,
  },
  qr: {
    marginTop: '20%',
    marginBottom: '20%',
    width: qrSize,
    height: qrSize,
    backgroundColor: 'transparent'
  },
  description: {
    fontSize: width * 0.06,
    marginTop: '10%',
    textAlign: 'center',
    width: '70%',
    color: 'white',
  },
  cancel: {
    fontSize: width * 0.05,
    textAlign: 'center',
    width: '70%',
    color: 'white',
  },
})