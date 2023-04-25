import React from "react";
import {
    ActivityIndicator,
    View
} from "react-native";

import styles from "./styles";

export default Spinner = () => {
    return(
        <View style={styles.loading}>
            <View style={{backgroundColor:'#ccc', width:40, height:40, borderRadius:20}}>
                <ActivityIndicator size='large' animating={true}/>
            </View>
        </View>
    )
}