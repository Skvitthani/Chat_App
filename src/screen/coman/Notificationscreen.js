import {useIsFocused} from '@react-navigation/native';
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
import {hp, ImageConst, Stringconst, wp} from '../../utils/helper/index';

const Notificationscreen = ({navigation}) => {
  const [activeUser, setActiveUser] = useState();
  const [activeUserUID, setActiveUserUID] = useState();
  const [matchRequest, setMatchRequest] = useState([]);
  const [matchId, setMatchId] = useState([]);

  const isFocuse = useIsFocused();

  const onAuthStateChanged = async user => {
    if (user) {
      const userUId = user?._user?.uid;
      setActiveUserUID(userUId);
      firestore()
        .collection('Users')
        .doc(userUId)
        .get()
        .then(snp => {
          setActiveUser(snp?.data());
        });
      firestore()
        .collection('Firends')
        .where('sendTo', '==', userUId)
        .get()
        .then(querySnapshot => {
          const data = querySnapshot?.docs?.map(snp => {
            return snp?.data();
          });
          setMatchRequest(data);
          const id = querySnapshot?.docs?.map(snp => {
            return snp?.id;
          });
          setMatchId(id);
        });
    }
  };

  useEffect(() => {
    auth().onAuthStateChanged(onAuthStateChanged);
  }, [isFocuse]);

  const onAddPress = (item, index) => {
    firestore()
      .collection('Users')
      .doc(activeUserUID)
      .collection('Firends')
      .doc(item?.sendFrom)
      .set(item);
    firestore()
      .collection('Users')
      .doc(item?.sendFrom)
      .collection('Firends')
      .doc(activeUserUID)
      .set({
        Photo: activeUser?.Photo,
        name: activeUser?.name,
        sendFrom: activeUser?.userId,
        sendTo: item?.sendFrom,
        Token: activeUser?.Token,
      });
    const data = matchRequest.filter((Item, Index) => Index !== index);
    setMatchRequest(data);
    const deleteId = matchId?.filter((id, indexs) => {
      if (indexs === index) {
        return id;
      }
    });
    const id = deleteId[0];
    firestore().collection('Firends').doc(id).delete();
  };

  const onCancelPress = (item, index) => {
    const data = matchRequest.filter((Item, Index) => Index !== index);
    setMatchRequest(data);
    const deleteId = matchId?.filter((id, indexs) => {
      if (indexs === index) {
        return id;
      }
    });
    const id = deleteId[0];

    firestore().collection('Firends').doc(id).delete();
  };

  const onbackPress = () => {
    navigation.navigate('Tabnavigate');
  };

  return (
    <View style={style.mainView}>
      <View style={style.headerstyle}>
        <TouchableOpacity onPress={onbackPress}>
          <Image source={ImageConst.arrow_png} style={style.headerImage} />
        </TouchableOpacity>
        <Text style={style.ProfileStyle}>Request</Text>
      </View>
      <FlatList
        ListEmptyComponent={() => {
          return (
            <View style={style.listEmptyComponent}>
              <Text style={style.norequest}>{Stringconst.norequest}</Text>
            </View>
          );
        }}
        data={matchRequest}
        renderItem={({item, index}) => {
          return (
            <View style={style.messageListStyle}>
              <View style={{flexDirection: 'row'}}>
                <Image source={{uri: item?.Photo}} style={style.userProfile} />
                <Text style={style.listUserName}>{item?.name}</Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  style={{alignSelf: 'center'}}
                  onPress={() => onAddPress(item, index)}>
                  <Image
                    source={ImageConst.add_friend_png}
                    style={style.addFriend}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{alignSelf: 'center'}}
                  onPress={() => onCancelPress(item, index)}>
                  <Image
                    source={ImageConst.cancel_png}
                    style={{
                      height: hp(2.3),
                      width: wp(5),
                      marginLeft: 10,
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};
const style = StyleSheet.create({
  mainView: {
    flex: 1,
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
  headerImage: {
    height: 25,
    width: 25,
    tintColor: 'white',
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
    alignSelf: 'center',
  },
  userProfile: {
    height: hp(6),
    width: wp(13),
    borderRadius: 50,
  },
  addFriend: {
    height: hp(2.3),
    width: wp(5),
  },
  listEmptyComponent: {
    alignItems: 'center',
  },
  norequest: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Notificationscreen;
