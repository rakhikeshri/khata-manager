import React , { PureComponent }  from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
// import NetInfo from "@react-native-community/netinfo";
import RootApp from './src/App';
import TextView from "core/TextView";

const { width } = Dimensions.get('window');

function MiniOfflineSign() {
  return (
    <View style={styles.offlineContainer}>
      <TextView style={styles.offlineText}>No Internet Connection</TextView>
    </View>
  );
}
export default class App extends PureComponent {
  state = {
    isConnected: true
  };

  componentDidMount() {
    // NetInfo.addEventListener(state => {
    //   this.setState({isConnected : state.isConnected})
    // });
  }

  componentWillUnmount() {
    // NetInfo.removeEventListener(state => {
    //   this.setState({isConnected : state.isConnected})
    // });
  }

  handleConnectivityChange = isConnected => {
      this.setState({ isConnected });
  };
  render(){
    if (!this.state.isConnected) {
      return <MiniOfflineSign />;
    }
    return (
      <View style={styles.container}>
        <RootApp />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
    offlineContainer: {
      backgroundColor: '#b52424',
      height: 30,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      width,
      position: 'absolute',
      top: 30
    },
    offlineText: { color: '#fff' }  
});

// "build:channel:android": "expo build:android --release-channel v1.0.0"