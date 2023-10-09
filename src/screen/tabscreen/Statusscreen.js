import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {hp, ImageConst, Stringconst, wp} from '../../utils/helper/index';
import ImageCropPicker from 'react-native-image-crop-picker';
import Modal from 'react-native-modal';
import {Button} from '../../components/Index';
import storage from '@react-native-firebase/storage';
import firestore, {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import moment from 'moment';
import {useIsFocused, useNavigation} from '@react-navigation/native';

const Statusscreen = () => {
  const [openModel, setopenModel] = useState(false);
  const [userFriendsId, setUserFriendsId] = useState([]);
  const [userStatus, setUserStatus] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);
  const [statusId, setStatusId] = useState([]);
  const [userUID, setUserUID] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const navigation = useNavigation();
  const isFocuse = useIsFocused();

  const onAuthStateChanged = async user => {
    if (user) {
      const userId = user?._user?.uid;
      setUserUID(userId);
      firestore()
        .collection('Users')
        .doc(userId)
        .get()
        .then(querySnapshot => {
          setCurrentUser(querySnapshot.data());
        });
      firestore()
        .collection('Users')
        .doc(userId)
        .collection('Firends')
        .get()
        .then(snp => {
          const ID = snp?.docs?.map(snp => {
            return snp?.id;
          });
          setUserFriendsId(ID);
        });
      firestore()
        .collection('Status')
        .get()
        .then(snp => {
          const status = snp?.docs?.map(snap => {
            if (userFriendsId.includes(snap.id)) {
              return snap?.data().Status;
            }
          });
          setUserStatus(status);
        });
    }
  };

  useEffect(() => {
    auth().onAuthStateChanged(onAuthStateChanged);
  }, [isFocuse]);

  const onImageSlectPress = () => {
    ImageCropPicker.openPicker({
      width: wp(25),
      height: hp(17),
      cropping: true,
    }).then(async image => {
      let imageData = {
        image: image.path,
      };
      setImageUrl(imageData);
      uploadImage(imageData);
      onCloseModelPress();
    });
  };

  const uploadImage = async imageData => {
    const imagePath = imageData?.image;
    const reference = storage().ref(`${imagePath}`);
    const pathToFile = `${imagePath}`;
    await reference.putFile(pathToFile);
    getUrl(reference?.path);
  };

  const getUrl = async reference => {
    const imageURL = await storage()
      .ref(reference)
      .getDownloadURL()
      .then(url => {
        return url;
      });
    uploadStatus(imageURL);
  };

  const uploadStatus = imageURL => {
    firestore()
      .collection('Status')
      .get()
      .then(snp => {
        const StatusId = snp?.docs?.map(snap => {
          return snap?.id;
        });
        setStatusId(StatusId);
      });
    const matchId = statusId.filter(i => {
      if (i === userUID) {
        return i;
      }
    });
    if (matchId.length === 0) {
      firestore()
        .collection('Status')
        .doc(userUID)
        .set({
          Status: firebase.firestore.FieldValue.arrayUnion({
            status: imageURL,
            userName: currentUser?.name,
            currenuserPhoto: currentUser?.Photo,
            ID: userUID,
          }),
        });
    } else {
      firestore()
        .collection('Status')
        .doc(userUID)
        .update({
          Status: firebase.firestore.FieldValue.arrayUnion({
            status: imageURL,
            userName: currentUser?.name,
            currenuserPhoto: currentUser?.Photo,
            ID: userUID,
          }),
        });
    }
  };

  const onCloseModelPress = () => {
    setopenModel(false);
  };
  return (
    <View style={style.mainView}>
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
            onPress={onCloseModelPress}
          />
        </View>
      </Modal>
      <View>
        <TouchableOpacity
          style={style.uploadStatus}
          onPress={() => setopenModel(true)}>
          <View style={style.GroupImageView}>
            {imageUrl ? (
              <Image
                source={{uri: imageUrl?.image}}
                style={style.GroupImageView}
              />
            ) : (
              <Image source={require('../../asset/Image/user.png')}style={style.user_png} />
            )}
          </View>
          <View style={style.textView}>
            <Text style={style.myStatus}>{Stringconst.mySatuts}</Text>
            <Text style={{marginLeft: wp(3)}}>{Stringconst.taptoupload}</Text>
          </View>
        </TouchableOpacity>
      </View>
      <Text style={style.recentUpdate}>{Stringconst.recentUpdate}</Text>
      <FlatList
        bounces={false}
        data={userStatus}
        renderItem={({item}) => {
          return (
            <View>
              {item !== undefined && (
                <TouchableOpacity
                  style={style.statusStyle}
                  onPress={() =>
                    navigation.navigate('Statusshowscreen', {
                      Status: item,
                    })
                  }>
                  <Image
                    source={{uri: item?.[0]?.status}}
                    style={style.statusImage}
                  />
                  <View style={style.nameAndTime}>
                    <Text style={style.userName}>{item?.[0]?.userName}</Text>
                    <Text>
                      {moment(item?.[0]?.createdAt).format('DD MMM YYYY')}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
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
  GroupImageView: {
    height: hp(7),
    width: wp(15.5),
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D2D6D3',
  },
  user_png: {
    height: hp(3.5),
    width: wp(7),
    marginBottom: wp(1),
    tintColor: 'white',
  },
  uploadStatus: {
    flexDirection: 'row',
    padding: 10,
  },
  textView: {
    paddingVertical: 6,
  },
  myStatus: {
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: wp(3),
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
  recentUpdate: {
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: wp(3),
  },
  statusImage: {
    height: hp(8),
    width: wp(17),
    borderRadius: 50,
  },
  statusStyle: {
    flexDirection: 'row',
    padding: 5,
  },
  nameAndTime: {
    padding: 10,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  progressBar: {
    height: 20,
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'white',
    borderColor: '#000',
    borderWidth: 2,
    borderRadius: 5,
  },
});

export default Statusscreen;
