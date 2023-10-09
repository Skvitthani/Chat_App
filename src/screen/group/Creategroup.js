import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useIsFocused} from '@react-navigation/native';
import {ImageConst} from '../../utils/helper/ImageConst';
import Modal from 'react-native-modal';
import ImageCropPicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import {Button} from '../../components/Index';
import {hp, wp} from '../../utils/helper/globalfunction/Responsivefont';

const Creategroup = ({route, navigation}) => {
  const user = route?.params?.paricipant;

  const [groupName, setGroupName] = useState('');
  const [activeUser, setActiveUser] = useState();
  const [userID, setUserID] = useState([]);
  const [Users, setUsers] = useState(user);
  const [openModel, setOpenModel] = useState(false);
  const [image, setImage] = useState('');

  const onAuthStateChanged = user => {
    if (user) {
      const userUId = user?._user?.uid;
      setUserID([userUId]);
      firestore()
        .collection('Users')
        .doc(userUId)
        .get()
        .then(querySnapshot => {
          setActiveUser(querySnapshot.data());
        });
    }
  };

  const isFocuse = useIsFocused();
  useEffect(() => {
    auth().onAuthStateChanged(onAuthStateChanged);
  }, [isFocuse]);

  const onBackPress = () => {
    navigation.navigate('Groupscreen');
  };

  const onCreateGroupPress = async () => {
    const imagePath = image?.image;
    const reference = storage().ref(`${imagePath}`);
    const pathToFile = `${imagePath}`;
    await reference.putFile(pathToFile);
    user?.map(i => {
      if (i?.sendFrom) {
        userID.push(i?.sendFrom);
      }
    });
    const ID = userID?.join('-');
    const admin = {
      admin: 'Group Admin',
    };
    Object.assign(activeUser, admin);
    Users.unshift(activeUser);
    const ImageUrl = await storage()
      .ref(imagePath)
      .getDownloadURL()
      .then(url => {
        return url;
      });
    let newData = [...Users];

    firestore().collection('GroupChat').doc(ID).set({
      Photo: ImageUrl,
      ID: userID,
      GroupChat: groupName,
      GroupData: newData,
    });

    setGroupName('');
    navigation.navigate('Tabnavigate');
  };

  const onCameraPress = () => {
    setOpenModel(!openModel);
  };

  const onImageSlectPress = () => {
    ImageCropPicker.openPicker({
      width: wp(25),
      height: hp(17),
      cropping: true,
    }).then(image => {
      let imageData = {
        image: image.path,
      };
      setImage(imageData);
      onCameraPress();
    });
  };

  return (
    <View style={{flex: 1, backgroundColor: '#ECECEC'}}>
      <Modal visible={openModel} animationType="slide">
        <View style={style.modelView}>
          <Button
            text={'Choose  From Gallary'}
            constButtonStyle={style.buttonView}
            containFontStyle={{marginRight: 30}}
            onPress={onImageSlectPress}
          />
          <Button
            text={'Cancle'}
            constButtonStyle={style.buttonView}
            containFontStyle={{marginRight: 60}}
            onPress={onCameraPress}
          />
        </View>
      </Modal>
      <View style={style.headerstyle}>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={onBackPress}>
            <Image source={ImageConst.arrow_png} style={style.headerImage} />
          </TouchableOpacity>
          <View style={{marginLeft: wp(5), marginTop: 8}}>
            <Text style={{color: 'white', fontSize: 20}}>New Group</Text>
          </View>
        </View>
        <TouchableOpacity style={style.addGroup} onPress={onCreateGroupPress}>
          <Image
            source={require('../../asset/Image/plus.png')}
            style={{height: 20, width: 20, tintColor: 'white'}}
          />
        </TouchableOpacity>
      </View>
      <View
        style={{
          height: hp(12),
          backgroundColor: 'white',
          flexDirection: 'row',
          padding: 10,
        }}>
        <TouchableOpacity style={style.GroupImageView} onPress={onCameraPress}>
          {image ? (
            <Image
              source={{uri: image?.image}}
              style={{
                height: hp(9),
                width: wp(20),
                borderRadius: 50,
              }}
            />
          ) : (
            <Image
              source={ImageConst.camera}
              style={{
                height: hp(3),
                width: wp(8),
              }}
            />
          )}
        </TouchableOpacity>

        <TextInput
          placeholder="Enter Group Name"
          placeholderTextColor={'black'}
          value={groupName}
          onChangeText={txt => setGroupName(txt)}
          style={style.inputStyle}
        />
      </View>
      <Text style={{fontSize: 15, padding: 15}}>
        Participants: {user?.length}
      </Text>
      <FlatList
        horizontal
        data={user}
        renderItem={({item}) => {
          return (
            <View style={{marginHorizontal: 10}}>
              <Image source={{uri: item?.Photo}} style={style.userProfile} />
              <Text>{item?.name}</Text>
            </View>
          );
        }}
      />
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
  inputStyle: {
    borderBottomWidth: 3,
    height: hp(5),
    width: wp(65),
    marginTop: hp(2),
    fontSize: 15,
  },
  userProfile: {
    height: hp(6),
    width: wp(13),
    borderRadius: 50,
  },
  addGroup: {
    width: wp(10),
    marginRight: wp(2),
    marginTop: hp(1),
  },
  GroupImageView: {
    height: hp(9),
    width: wp(20),
    borderRadius: 50,
    marginRight: wp(2),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF0F1',
  },
  modelView: {
    backgroundColor: '#E5E5E5',
    alignSelf: 'center',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    width: wp(100),
    height: hp(20),
    position: 'absolute',
    bottom: hp(-2),
  },
  buttonView: {
    borderWidth: 0,
    backgroundColor: '#F42C7E',
    marginTop: hp(3),
    borderRadius: 10,
    marginHorizontal: wp(10),
    width: wp(78),
  },
});

export default Creategroup;
