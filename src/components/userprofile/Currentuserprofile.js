import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Userphoto from './Userphoto';
import {hp, ImageConst, wp} from '../../utils/helper/index';

const Currentuserprofile = ({onPress}) => {
  const [userData, setUserData] = useState([]);
  const [showUserphoto, setShowUserphoto] = useState(false);
  const isFocuse = useIsFocused();

  const onAuthStateChanged = async user => {
    if (user) {
      const userUId = user?._user?.uid;
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

  const onUserphotoPress = () => {
    setShowUserphoto(!showUserphoto);
  };

  return (
    <View style={{flex: 1}}>
      {showUserphoto === false ? (
        <>
          <View style={style.headerstyle}>
            <TouchableOpacity onPress={onPress}>
              <Image source={ImageConst.arrow_png} style={style.headerImage} />
            </TouchableOpacity>
            <Text style={style.ProfileStyle}>Profile</Text>
          </View>
          <TouchableOpacity onPress={onUserphotoPress}>
            <Image source={{uri: userData?.Photo}} style={style.profilePic} />
          </TouchableOpacity>
          <View style={{flexDirection: 'row', marginTop: hp(3)}}>
            <Image source={require('../../asset/Image/user.png')} style={style.usericon} />
            <View>
              <Text style={{color: '#A7A7A5', fontSize: 20}}>Name</Text>
              <Text style={{fontSize: 20}}>{userData?.name}</Text>
            </View>
          </View>
        </>
      ) : (
        <Userphoto onPress={onUserphotoPress} Photo={userData?.Photo} />
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
  ProfileStyle: {
    fontWeight: '600',
    fontSize: 20,
    marginLeft: 20,
    marginTop: 5,
    color: 'white',
  },
  profilePic: {
    height: hp(22.2),
    width: wp(50),
    alignSelf: 'center',
    marginTop: hp(3),
    borderRadius: 100,
  },
  usericon: {
    height: hp(3),
    width: wp(6),
    tintColor: '#A7A7A5',
    marginHorizontal: wp(5),
  },
});

export default Currentuserprofile;
