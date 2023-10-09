import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  FlatList,
} from 'react-native';
import {goBack, navigate} from '../../navigation/NavigateRef';
import {hp, ImageConst, Stringconst, wp} from '../../utils/helper/index';
import firestore, {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const Addgroupmemberscreen = ({route}) => {
  const GroupId = route?.params?.GroupId;
  const isFocuse = useIsFocused();

  const [groupData, setGroupData] = useState([]);
  const [userFriend, setUserFriend] = useState([]);
  const [addFirend, setAddFirend] = useState([]);

  const onAuthStateChanged = user => {
    if (user) {
      const userId = user?._user?.uid;
      firestore()
        .collection('GroupChat')
        .doc(GroupId)
        .get()
        .then(snap => {
          setGroupData(snap.data());
        });

      firestore()
        .collection('Users')
        .doc(userId)
        .collection('Firends')
        .get()
        .then(snap => {
          const data = snap?.docs?.map(snp => {
            return snp.data();
          });
          setUserFriend(data);
        });
    }
  };
  const groupUserId = groupData.ID;

  useEffect(() => {
    auth().onAuthStateChanged(onAuthStateChanged);
  }, [isFocuse]);
  const addParticipantPress = item => {
    const filter = addFirend.filter(i => {
      if (i?.name === item?.name) {
        return item;
      }
    });

    if (filter?.length === 0) {
      setAddFirend([...addFirend, item]);
    }
  };
  const onRemovePress = index => {
    const afterRemove = addFirend?.filter((Item, Index) => {
      if (Index !== index) {
        return Item;
      }
    });
    setAddFirend(afterRemove);
  };

  const onAddPress = () => {
    const userId = addFirend.map(i => {
      if (i?.sendFrom) {
        return i?.sendFrom;
      }
    });
    userId.map(i => {
      firestore()
        .collection('GroupChat')
        .doc(GroupId)
        .update({
          ID: firebase.firestore.FieldValue.arrayUnion(i),
        });
    });
    addFirend.map(item => {
      firestore()
        .collection('GroupChat')
        .doc(GroupId)
        .update({
          GroupData: firebase.firestore.FieldValue.arrayUnion({
            Photo: item?.Photo,
            Token: item?.Token,
            name: item?.name,
            sendFrom: item?.sendFrom,
            sendTo: item?.sendTo,
          }),
        });
    });
    navigate('Tabnavigate');
  };
  return (
    <View style={style.container}>
      <View style={style.headerStyle}>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => goBack()}>
            <Image source={ImageConst.arrow_png} style={style.headerImage} />
          </TouchableOpacity>
          <Text style={style.addGroupMember}>{Stringconst.addGroupMember}</Text>
        </View>
        {addFirend?.length !== 0 && (
          <TouchableOpacity style={style.addMember} onPress={onAddPress}>
            <Text style={{color: 'white', fontSize: 20}}>
              {Stringconst.add}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <View>
        <FlatList
          horizontal
          data={addFirend}
          renderItem={({item, index}) => {
            return (
              <View style={style.selectedUser}>
                <Text>{item?.name}</Text>
                <TouchableOpacity onPress={() => onRemovePress(index)}>
                  <Image
                    source={ImageConst.cancel_png}
                    style={style.cancel_png}
                  />
                </TouchableOpacity>
              </View>
            );
          }}
        />
        <FlatList
          data={userFriend}
          renderItem={({item}) => {
            return (
              <View>
                {groupUserId.includes(item?.sendFrom) ? (
                  <View style={style.messageListStyle}>
                    <View style={{flexDirection: 'row'}}>
                      <Image
                        source={{uri: item?.Photo}}
                        style={style.userProfile}
                      />
                      <Text style={style.listUserName}>{item?.name}</Text>
                    </View>
                    <View style={style.addAndAdded}>
                      <Text style={{color: 'white'}}>{Stringconst.added}</Text>
                    </View>
                  </View>
                ) : (
                  <View style={style.messageListStyle}>
                    <View style={{flexDirection: 'row'}}>
                      <Image
                        source={{uri: item?.Photo}}
                        style={style.userProfile}
                      />
                      <Text style={style.listUserName}>{item?.name}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => addParticipantPress(item)}
                      style={[style.addAndAdded, {backgroundColor: '#797979'}]}>
                      <Text style={{color: 'white'}}>{Stringconst.add}</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          }}
        />
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerImage: {
    height: hp(3),
    width: wp(7),
    tintColor: 'white',
    marginTop: hp(1.6),
    marginLeft: wp(3),
  },
  headerStyle: {
    backgroundColor: '#2B2D5E',
    height: Platform.OS === 'ios' ? hp(12) : hp(9),
    flexDirection: 'row',
    paddingTop: Platform.OS === 'ios' ? hp(5) : hp(2),
    justifyContent: 'space-between',
  },
  addGroupMember: {
    marginTop: hp(1.7),
    color: 'white',
    marginLeft: wp(3),
    fontSize: 17,
    fontWeight: '500',
  },
  userProfile: {
    height: hp(6),
    width: wp(13),
    borderRadius: 50,
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
  addAndAdded: {
    width: wp(15),
    height: hp(3.5),
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 10,
    backgroundColor: '#B3B3B3',
  },
  selectedUser: {
    height: hp(4),
    marginHorizontal: 10,
    marginVertical: 5,
    flexDirection: 'row',
    borderWidth: 1,
    alignItems: 'center',
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  cancel_png: {
    height: hp(2),
    width: wp(4.3),
    marginLeft: wp(2),
  },
  addMember: {
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: wp(15),
    height: hp(5),
  },
});

export default Addgroupmemberscreen;
