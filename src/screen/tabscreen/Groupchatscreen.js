import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
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

const Groupchatscreen = () => {
  const [group, setGroup] = useState([]);
  const [activeUserId, setActiveUserId] = useState('');
  const [activeUser, setActiveuser] = useState([]);
  const navigation = useNavigation();

  const isFocuse = useIsFocused();

  const onAuthStateChanged = async user => {
    if (user) {
      const userUId = user?._user?.uid;
      setActiveUserId(userUId);
      firestore()
        .collection('Users')
        .doc(userUId)
        .get()
        .then(querySnapshot => {
          setActiveuser(querySnapshot.data());
        });
      firestore()
        .collection('GroupChat')
        .get()
        .then(querySnapshot => {
          const data = querySnapshot.docs.map(snp => {
            if (snp.data()?.ID?.includes(userUId)) {
              return {
                id: snp.id,
                data: snp.data(),
              };
            }
          });
          setGroup(data);
        });
    }
  };

  useEffect(() => {
    auth().onAuthStateChanged(onAuthStateChanged);
  }, [isFocuse]);

  const onGroupChatPress = item => {
    navigation.navigate('Chatescreen', {
      groupData: item,
      curentUserID: activeUserId,
      currentUser: activeUser,
    });
  };

  const onGroupPress = () => {
    navigation.navigate('Groupscreen');
  };

  return (
    <View style={{flex: 1}}>
      <FlatList
        bounces={false}
        data={group}
        renderItem={({item}) => {
          return (
            <View>
              {item !== undefined && (
                <TouchableOpacity
                  style={style.messageListStyle}
                  onPress={() => onGroupChatPress(item)}>
                  <View style={{flexDirection: 'row'}}>
                    <View>
                      <Image
                        source={{uri: item?.data?.Photo}}
                        style={style.userProfile}
                      />
                    </View>
                    <View>
                      <Text style={style.listUserName}>
                        {item?.data?.GroupChat}
                      </Text>
                      {item?.data?.lastmessage ? (
                        <>
                          {item?.data?.lastmessage[0]?.image === '' ? (
                            <Text style={{marginLeft: 30, marginTop: 2}}>
                              {item?.data?.lastmessage[0]?.text}
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
                  {item?.data?.lastmessage ? (
                    <View style={{marginTop: 5}}>
                      <Text>
                        {moment(item?.data?.lastmessage[0]?.createdAt).format(
                          'DD MMM YYYY',
                        )}
                      </Text>
                    </View>
                  ) : (
                    <></>
                  )}
                </TouchableOpacity>
              )}
            </View>
          );
        }}
      />
      <TouchableOpacity style={style.userListButton} onPress={onGroupPress}>
        <Image
          source={require('../../asset/Image/plus.png')}
          style={{height: 20, width: 20, tintColor: 'white'}}
        />
      </TouchableOpacity>
    </View>
  );
};

const style = StyleSheet.create({
  messageListStyle: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  userProfile: {
    height: hp(6),
    width: wp(13),
    borderRadius: 50,
  },
  listUserName: {
    fontSize: 20,
    marginLeft: 30,
    marginTop: 3,
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
});

export default Groupchatscreen;
