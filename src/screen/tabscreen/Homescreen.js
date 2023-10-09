import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {ImageConst} from '../../utils/helper/ImageConst';
import moment from 'moment';
import {hp, wp} from '../../utils/helper/globalfunction/Responsivefont';

const Homescreen = () => {
  const [userData, setUserData] = useState([]);
  const [activeUser, setActiveUser] = useState('');
  const [Header, setHeader] = useState('');

  const navigation = useNavigation();

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
          setHeader(querySnapshot.data());
        });
      firestore().collection('Users').doc(userUId).update({
        status: 'online',
      });
      firestore()
        .collection('Users')
        .doc(userUId)
        .collection('Firends')
        .get()
        .then(querySnapshot => {
          const data = querySnapshot?.docs?.map(snp => {
            return snp?.data();
          });
          setUserData(data);
        });
    }
  };

  useEffect(() => {
    auth().onAuthStateChanged(onAuthStateChanged);
  }, [isFocuse]);

  const onItemPress = item => {
    navigation.navigate('Chatescreen', {
      item: item,
      curentUserID: activeUser,
      currentUser: Header,
    });
  };

  const onUserListPress = () => {
    navigation.navigate('Userlistscreen');
  };

  return (
    <View style={{flex: 1}}>
      <StatusBar backgroundColor={'#2B2D5E'} />
      <View style={{flex: 1}}>
        <FlatList
          bounces={false}
          data={userData}
          renderItem={({item}) => {
            return (
              <View>
                <TouchableOpacity
                  style={style.messageListStyle}
                  onPress={() => onItemPress(item)}>
                  <View style={{flexDirection: 'row'}}>
                    <View>
                      <Image
                        source={{uri: item?.Photo}}
                        style={style.userProfile}
                      />
                    </View>
                    <View>
                      <Text style={style.listUserName}>{item?.name}</Text>
                      {item?.lastmessage ? (
                        <>
                          {item?.lastmessage[0]?.image === '' ? (
                            <Text style={{marginLeft: 30, marginTop: 2}}>
                              {item?.lastmessage[0]?.text}
                            </Text>
                          ) : (
                            <View style={{flexDirection: 'row', marginTop: 5}}>
                              <Image
                                source={ImageConst.gallery_png}
                                style={{
                                  height: hp(1.8),
                                  width: wp(4),
                                  marginLeft: 30,
                                }}
                              />
                              <Text style={{marginLeft: 5}}>Photo</Text>
                            </View>
                          )}
                        </>
                      ) : (
                        <></>
                      )}
                    </View>
                  </View>
                  {item?.lastmessage ? (
                    <View style={{marginTop: 5}}>
                      <Text>
                        {moment(item?.lastmessage[0]?.createdAt).format(
                          'DD MMM YYYY',
                        )}
                      </Text>
                    </View>
                  ) : (
                    <></>
                  )}
                </TouchableOpacity>
              </View>
            );
          }}
        />
        <TouchableOpacity
          style={style.userListButton}
          onPress={onUserListPress}>
          <Image
            source={require('../../asset/Image/plus.png')}
            style={{height: 20, width: 20, tintColor: 'white'}}
          />
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
  userName: {
    fontSize: 20,
    marginTop: 10,
    marginLeft: 15,
    color: 'white',
  },
  logOut: {
    height: 35,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  messageListStyle: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  listUserName: {
    fontSize: 20,
    marginLeft: 30,
    marginTop: 3,
  },
  activeUserName: {
    fontSize: 20,
    color: 'white',
    marginLeft: 30,
    marginTop: 10,
  },
  userListButton: {
    backgroundColor: '#2B2D5D',
    height: hp(6),
    width: wp(13),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(5),
    marginRight: wp(5),
    borderRadius: 40,
    position: 'absolute',
    bottom: 0,
    right: 15,
  },
  lastMessage: {
    marginLeft: 30,
    marginTop: 5,
    color: '#575A5D',
  },
});

export default Homescreen;
