import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {ImageConst} from '../../utils/helper/ImageConst';
import {hp, wp} from '../../utils/helper/globalfunction/Responsivefont';
import {Currentuserprofile} from '../../components/Index';

const Settingscreen = ({navigation}) => {
  const [userData, setUserData] = useState([]);
  const [openProfile, setOpenProfile] = useState(false);
  const [showSetting, setShowSetting] = useState(false);
  const [activeUser, setActiveUser] = useState('');

  const isFocuse = useIsFocused();

  const onAuthStateChanged = async user => {
    if (user) {
      const userUId = user?._user?.uid;
      setActiveUser(userUId);
      firestore()
        .collection('Users')
        .doc(userUId)
        .get()
        .then(querySnapshot => {
          setUserData(querySnapshot.data());
        });
    }
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, [isFocuse]);

  const onOpenProfilePress = () => {
    setOpenProfile(!openProfile);
    setShowSetting(!showSetting);
  };

  const onBackPress = () => {
    navigation.navigate('Tabnavigate');
  };

  const onLogoutPress = () => {
    firestore().collection('Users').doc(activeUser).update({
      status: firestore.FieldValue.serverTimestamp(),
    });
    auth().signOut();
    navigation.navigate('Signupscreen');
  };

  return (
    <View style={{flex: 1}}>
      {showSetting === false && (
        <View style={{flex: 1}}>
          <View style={style.headerstyle}>
            <TouchableOpacity onPress={onBackPress}>
              <Image source={ImageConst.arrow_png} style={style.headerImage} />
            </TouchableOpacity>
            <Text style={style.settingStyle}>Setting</Text>
          </View>
          <TouchableOpacity
            style={style.profileView}
            onPress={onOpenProfilePress}>
            <Image source={{uri: userData?.Photo}} style={style.userPhoto} />
            <View>
              <Text style={{fontSize: 30, marginLeft: 20, marginTop: 7}}>
                {userData?.name}
              </Text>
              <Text style={{marginLeft: 20}}>{userData?.email}</Text>
            </View>
          </TouchableOpacity>
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              marginBottom: hp(3),
            }}>
            <TouchableOpacity
              style={style.logoutButton}
              onPress={onLogoutPress}>
              <Text style={{fontSize: 20, color: 'red', marginLeft: 10}}>
                Log Out
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {openProfile === true && (
        <Currentuserprofile onPress={onOpenProfilePress} />
      )}
    </View>
  );
};

const style = StyleSheet.create({
  headerImage: {
    height: 25,
    width: 25,
    tintColor: 'white',
    marginTop: 5,
  },
  headerstyle: {
    backgroundColor: '#2B2D5E',
    height: hp(10),
    paddingTop: hp(5),
    paddingLeft: wp(5),
    flexDirection: 'row',
  },
  settingStyle: {
    fontWeight: '600',
    fontSize: 20,
    marginLeft: 20,
    marginTop: 5,
    color: 'white',
  },
  userPhoto: {
    height: hp(9),
    width: wp(20),
    borderRadius: 50,
  },
  accountImage: {
    height: hp(5),
    width: wp(10),
  },
  profileView: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 0.4,
  },
  accountView: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginTop: 5,
  },
  accountName: {
    marginLeft: wp(6),
    fontSize: 30,
    fontWeight: '700',
  },
  logoutButton: {
    height: hp(5),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#A7A7A5',
  },
});

export default Settingscreen;
