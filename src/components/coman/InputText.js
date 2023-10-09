import React from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import { hp, wp } from '../../utils/helper/globalfunction/Responsivefont';

const InputText = ({value, placeholder,autoCapitalize, onChangeText, containerStyle,secureTextEntry}) => {
  return (
    <View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={[style.inputStyle, containerStyle]}
        placeholder={placeholder}
        placeholderTextColor={'#A8A8A8'}
        autoCapitalize={autoCapitalize}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
};

const style = StyleSheet.create({
  inputStyle: {
    borderWidth: 1,
    height: hp(5),
    marginHorizontal: wp(5),
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 15,
    fontWeight: '700',
  },
});

export default InputText;
