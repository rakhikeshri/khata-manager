import React from "react";
import { Provider } from "react-redux";
import { View, StyleSheet } from "react-native";
import store from "./store";
import StackRoutes from "./router/StackRoutes";
import { ModalPortal } from 'react-native-modals';

// import AppNavigator from "./router/AppNavigator";

export default class App extends React.Component {
  render() {
    return (
      <View style = {styles.container}>
        <Provider store = {store}>
          <StackRoutes />
          <ModalPortal />
        </Provider>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    flexDirection: "column",
    backgroundColor: "#fff",
  }
})
