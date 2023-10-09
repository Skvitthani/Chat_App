import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {ImageConst} from '../../utils/helper/ImageConst';
import {hp, wp} from '../../utils/helper/globalfunction/Responsivefont';

const Customheader = () => {
  const [Header, setHeader] = useState('');
  const isFocuse = useIsFocused();
  const navigation = useNavigation();

  const onAuthStateChanged = async user => {
    if (user) {
      const userUId = user?._user?.uid;
      firestore()
        .collection('Users')
        .doc(userUId)
        .get()
        .then(querySnapshot => {
          setHeader(querySnapshot.data());
        });
    }
  };

  useEffect(() => {
    auth().onAuthStateChanged(onAuthStateChanged);
  }, [isFocuse]);

  const onNotificationPress = () => {
    navigation.navigate('Notificationscreen');
  };

  const onOptionPress = () => {
    navigation.navigate('Settingscreen');
  };
  return (
    <View style={style.headerStyle}>
      <View style={{flexDirection: 'row'}}>
        <Image source={{uri: Header?.Photo}} style={style.userProfile} />
        <Text style={style.activeUserName}>{Header?.name}</Text>
      </View>
      <View style={style.imageView}>
        <TouchableOpacity onPress={onNotificationPress}>
          <Image source={ImageConst.bell_png} style={style.notification} />
        </TouchableOpacity>
        <TouchableOpacity style={style.logOut} onPress={onOptionPress}>
          <Image source={ImageConst.options_png} style={style.optionStyle} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  userProfile: {
    height: hp(6),
    width: wp(13),
    borderRadius: 50,
  },
  headerStyle: {
    height: Platform.OS === 'ios' ? hp(14) : hp(11),
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: Platform.OS === 'ios' ? hp(6.5) : hp(4),
    backgroundColor: '#2B2D5E',
  },
  activeUserName: {
    fontSize: 20,
    color: 'white',
    marginLeft: 30,
    marginTop: 10,
  },
  optionStyle: {
    height: hp(4),
    width: wp(6),
    tintColor: 'white',
  },
  notification: {
    height: hp(3),
    width: wp(6),
    tintColor: 'white',
    marginTop: hp(0.5),
  },
  imageView: {
    flexDirection: 'row',
    width: wp(25),
    justifyContent: 'space-around',
  },
});

export default Customheader;
