import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const Button = ({text, source, IamgeStyle,containFontStyle,constButtonStyle,onPress}) => {
  return (
    <View>
      <TouchableOpacity style={[style.buttonStyle,constButtonStyle]} onPress={onPress}>
        <Image source={source} style={[IamgeStyle]} />
        <Text style={[style.fontStyle,containFontStyle]}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
};
const style = StyleSheet.create({
  buttonStyle: {
    flexDirection: 'row',
    borderWidth: 1,
    height: 35,
    width: 130,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderRadius : 20
  },
  fontStyle : {
    fontSize : 20
  }
});

export default Button;
