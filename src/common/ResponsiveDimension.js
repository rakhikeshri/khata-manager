import {
    Dimensions,
    PixelRatio
} from 'react-native';

const wToDP = widthPercent => {
    const screenWidth = Dimensions.get('window').width;
    // Convert string input to decimal number
    const elemWidth = parseFloat(widthPercent);
    
    return PixelRatio.roundToNearestPixel(screenWidth * elemWidth / 100);
};

const hToDP = heightPercent => {
    const screenHeight = Dimensions.get('window').height;
    // Convert string input to decimal number
    const elemHeight = parseFloat(heightPercent);
    
    return PixelRatio.roundToNearestPixel(screenHeight * elemHeight / 100);
};

export {
  wToDP,
  hToDP
};