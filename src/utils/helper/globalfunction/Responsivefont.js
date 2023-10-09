
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';



export const wp = val => responsiveScreenWidth(val);

export const hp = val => responsiveScreenHeight(val);
