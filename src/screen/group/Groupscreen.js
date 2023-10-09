import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {ImageConst} from '../../utils/helper/ImageConst';
import {hp, wp} from '../../utils/helper/globalfunction/Responsivefont';

const Groupscreen = () => {
  const [userData, setUserData] = useState([]);
  const [addFirend, setAddFirend] = useState([]);
  const isFocuse = useIsFocused();
  const navigation = useNavigation();

  const onAuthStateChanged = async user => {
    if (user) {
      const userUId = user?._user?.uid;
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
    } else {
    }
  };

  useEffect(() => {
    auth().onAuthStateChanged(onAuthStateChanged);
  }, [isFocuse]);

  const onBackPress = () => {
    navigation.goBack('Userlistscreen');
  };

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

  const onCreatePress = () => {
    navigation.navigate('Creategroup', {
      paricipant: addFirend,
    });
  };

  return (
    <View style={{flex: 1}}>
      <View style={style.headerstyle}>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={onBackPress}>
            <Image source={ImageConst.arrow_png} style={style.headerImage} />
          </TouchableOpacity>
          <View style={{marginLeft: wp(5)}}>
            <Text style={{color: 'white', fontSize: 20}}>Create Group</Text>
            <Text style={{color: 'white'}}>Add participant</Text>
          </View>
        </View>
        {addFirend?.length !== 0 && (
          <TouchableOpacity style={style.createGroup} onPress={onCreatePress}>
            <Text style={{color: 'white', fontSize: 20}}>Create</Text>
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
                    style={{
                      height: hp(2),
                      width: wp(4.3),
                      marginLeft: wp(2),
                    }}
                  />
                </TouchableOpacity>
              </View>
            );
          }}
        />
        <FlatList
          data={userData}
          bounces={false}
          renderItem={({item}) => {
            return (
              <View>
                <TouchableOpacity
                  style={style.messageListStyle}
                  onPress={() => addParticipantPress(item)}>
                  <View style={{flexDirection: 'row'}}>
                    <Image
                      source={{uri: item?.Photo}}
                      style={style.userProfile}
                    />
                    <Text style={style.listUserName}>{item?.name}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  headerImage: {
    height: 30,
    width: 30,
    tintColor: 'white',
    marginTop: 5,
  },
  headerstyle: {
    backgroundColor: '#2B2D5E',
    height: Platform.OS === 'ios' ? hp(12) : hp(11),
    paddingTop: Platform.OS === 'ios' ? hp(6) : hp(4),
    paddingLeft: wp(5),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  messageListStyle: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 10,
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
  createGroup: {
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: wp(15),
    height: hp(5),
  },
});

export default Groupscreen;
