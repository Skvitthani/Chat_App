import React, {useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import { hp, wp } from '../../utils/helper/globalfunction/Responsivefont';
import { ImageConst } from '../../utils/helper/ImageConst';
import { Button,InputText } from '../Index';

const LoginComponent = ({
  onGoogleButtonPress,
  onFacebookIosButtonPress,
  onFacebookButtonPress,
  Pass,
  userName,
  onSignInPress
}) => {
  return (
    <View>
      <Text style={style.loginFont}>Welcome Back!</Text>
      <View style={style.inputStyle}>
        <Image
          source={require('../../asset/Image/email.png')}
          style={style.imageStyle}
        />
        <InputText
          placeholder={'Email'}
          containerStyle={style.inputTextStyle}
          onChangeText={userName}
          autoCapitalize={'none'}
        />
      </View>
      <View style={style.inputStyle}>
        <Image
          source={require('../../asset/Image/padlock.png')}
          style={style.imageStyle}
        />
        <InputText
          placeholder={'Password'}
          containerStyle={style.inputTextStyle}
          secureTextEntry={true}
          onChangeText={Pass}
        />
      </View>
      <Button
      onPress={onSignInPress}
        constButtonStyle={style.loginButton}
        text={'Sign In'}
        containFontStyle={{color: 'white'}}
      />
      <View
        style={{flexDirection: 'row', marginTop: 10, justifyContent: 'center'}}>
        <View style={style.borderStyle} />
        <Text style={{marginHorizontal: 10, fontSize: 20}}>
          Or sign Up with
        </Text>
        <View style={style.borderStyle} />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          marginTop: 20,
        }}>
        <Button
          onPress={onGoogleButtonPress}
          text={'Google'}
          source={require('../../asset/Image/google.png')}
          IamgeStyle={{height: 20, width: 20}}
        />
        <Button
          text={'Facebook'}
          containFontStyle={{color: 'white'}}
          constButtonStyle={{backgroundColor: '#2B2D5E'}}
          source={ImageConst.facebook_png}
          IamgeStyle={{height: 20, width: 20, tintColor: 'white'}}
          onPress={() => {
            Platform.OS === 'ios'
              ? onFacebookIosButtonPress()
              : onFacebookButtonPress();
          }}
        />
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  loginFont: {
    fontSize: 35,
    alignSelf: 'center',
    color: '#2B2D5E',
    marginVertical: 20,
  },
  inputStyle: {
    flexDirection: 'row',
    borderWidth: 1,
    height: hp(5),
    marginHorizontal: wp(5),
    borderRadius: 15,
    marginVertical: 15,
  },
  inputTextStyle: {
    width: wp(80),
    marginHorizontal: wp(0),
    borderWidth: 0,
  },
  imageStyle: {
    height: 20,
    width: 20,
    alignSelf: 'center',
    marginLeft: 5,
    tintColor: '#2B2D5E',
  },
  loginButton: {
    height: hp(6),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    marginTop: hp(3),
    backgroundColor: '#2B2D5E',
    width: wp(70),
    alignSelf: 'center',
  },
  borderStyle: {
    borderTopWidth: 1,
    width: 100,
    alignSelf: 'center',
  },
});

export default LoginComponent;
