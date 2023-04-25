import React from "react";
import { connect } from "react-redux";
import { 
  View,
  StatusBar,
} from "react-native";

import WebView from "react-native-webview";

import styles from "./styles";

@connect((store) => {
  return {
    user: store.auth.user,
    scanned: store.orders.scanned,
    reports: store.report.reports
  }
})
export default class PlayHelpTopic extends React.Component {
    render() {
        const { route } = this.props;
        const id = route?.params.id;
        return (
            <View style = {styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="#1CBD9C" translucent = {false} />
                <WebView
                    style={{flex:1}}
                    javaScriptEnabled={true}
                    allowsFullscreenVideo
                    allowsInlineMediaPlayback
                    source={{ uri : "https://youtu.be/"+id }}
                />
            </View>
        )
    }
}