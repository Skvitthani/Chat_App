import React, {useEffect, useState} from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {Bubble, GiftedChat, InputToolbar, Send} from 'react-native-gifted-chat';
// import {ImageConst} from '../../utils/helper/ImageConst';
import Modal from 'react-native-modal';
import ImageCropPicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import uuid from 'react-native-uuid';
import Notificationservice from '../../utils/notification/Notificationservice';
import {useIsFocused} from '@react-navigation/native';
import {Button, Userprofile} from '../../components/Index';
// import {hp, wp} from '../../utils/helper/globalfunction/Responsivefont';
import {hp, ImageConst, Stringconst, wp} from '../../utils/helper/index';

const Chatescreen = ({route, navigation}) => {
  const items = route?.params?.item;
  const currentUser = route?.params?.currentUser;
  const curentUserID = route?.params?.curentUserID;
  const reciverUID = items?.sendFrom;
  const group = route?.params?.groupData;
  const UID = group?.id;
  const GroupMembers = group?.data?.GroupData;

  const takeToken = GroupMembers?.map(token => {
    if (token?.Token && token?.Token !== currentUser?.Token) {
      return token?.Token;
    }
  });

  const [messages, setMessages] = useState([]);
  const [showChatScreen, setShowChatScreen] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [openModel, setOpenModel] = useState(false);
  const [image, setImage] = useState('');
  const [ImageUrl, setImageUrl] = useState('');
  const [lastMessage, setLastMessage] = useState([]);
  const [groupLastMessage, setGroupLastMessage] = useState([]);
  const [addGroupMemberModel, setAddGroupMemberModel] = useState(false);

  const isFocuse = useIsFocused();

  useEffect(() => {
    allMessage();
  }, [isFocuse]);

  const allMessage = () => {
    if (group) {
      const snapShot = firestore()
        .collection('GroupChat')
        .doc(UID)
        .collection('Message')
        .orderBy('createdAt', 'desc');
      snapShot.onSnapshot(snp => {
        const message = snp.docs.map(snap => {
          return {...snap.data(), createdAt: snap?.data()?.createdAt?.toDate()};
        });
        setMessages(message);
      });
      const snp = firestore()
        .collection('GroupChat')
        .doc(UID)
        .collection('Message')
        .orderBy('createdAt', 'desc')
        .limit(1);
      snp.onSnapshot(snap => {
        const GroupLastMessage = snap.docs.map(snap => {
          return snap.data();
        });
        setGroupLastMessage(GroupLastMessage);
      });
    } else {
      const msgUID =
        curentUserID > reciverUID
          ? curentUserID + reciverUID + '123'
          : reciverUID + curentUserID + '123';
      const querySnapShot = firestore()
        .collection('Chats')
        .doc(msgUID)
        .collection('Message')
        .orderBy('createdAt', 'desc');
      querySnapShot.onSnapshot(snapShot => {
        const allMessages = snapShot.docs.map(snp => {
          return {...snp.data(), createdAt: snp?.data()?.createdAt?.toDate()};
        });
        setMessages(allMessages);
      });
      const snp = firestore()
        .collection('Chats')
        .doc(msgUID)
        .collection('Message')
        .orderBy('createdAt', 'desc')
        .limit(1);
      snp.onSnapshot(snap => {
        const lastmessage = snap.docs.map(snap => {
          return snap.data();
        });
        setLastMessage(lastmessage);
      });
    }
  };

  const Users = {
    _id: curentUserID,
    name: currentUser?.name,
  };

  const onSend = async messagesArray => {
    const msg = messagesArray[0];
    if (group) {
      const myMeg = {
        ...msg,
        sender: curentUserID,
        image: ImageUrl,
        createdAt: new Date(),
      };
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, myMeg),
      );
      firestore()
        .collection('GroupChat')
        .doc(UID)
        .collection('Message')
        .add(myMeg, {
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
      setImageUrl('');
    } else {
      const myMeg = {
        ...msg,
        sender: curentUserID,
        reciver: reciverUID,
        image: ImageUrl,
        createdAt: new Date(),
      };
      const msgUID =
        curentUserID > reciverUID
          ? curentUserID + reciverUID + '123'
          : reciverUID + curentUserID + '123';
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, myMeg),
      );
      firestore()
        .collection('Chats')
        .doc(msgUID)
        .collection('Message')
        .add(myMeg, {
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
      setImageUrl('');
    }
  };

  const onSendSned = async messagesArray => {
    if (group) {
      const myMeg = {
        _id: uuid.v4(),
        sender: curentUserID,
        image: messagesArray,
        createdAt: firestore.FieldValue.serverTimestamp(),
        user: {
          ...Users,
        },
      };
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, myMeg),
      );
      firestore()
        .collection('GroupChat')
        .doc(UID)
        .collection('Message')
        .add(myMeg, {
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
      setImageUrl('');
    } else {
      const myMeg = {
        _id: uuid.v4(),
        sender: curentUserID,
        reciver: reciverUID,
        image: messagesArray,
        createdAt: firestore.FieldValue.serverTimestamp(),
        user: {
          ...Users,
        },
      };
      const msgUID =
        curentUserID > reciverUID
          ? curentUserID + reciverUID + '123'
          : reciverUID + curentUserID + '123';
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, myMeg),
      );
      firestore()
        .collection('Chats')
        .doc(msgUID)
        .collection('Message')
        .add(myMeg, {
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
      setImageUrl('');
    }
  };

  const onUserProfilePress = () => {
    setShowProfile(!showProfile);
    setShowChatScreen(!showChatScreen);
  };

  const onBackPress = () => {
    if (lastMessage.length !== 0 || groupLastMessage.length !== 0) {
      if (group) {
        firestore().collection('GroupChat').doc(UID).update({
          lastmessage: groupLastMessage,
        });
        navigation.navigate('Tabnavigate');
      } else {
        firestore()
          .collection('Users')
          .doc(curentUserID)
          .collection('Firends')
          .doc(reciverUID)
          .update({
            lastmessage: lastMessage,
          });
        firestore()
          .collection('Users')
          .doc(reciverUID)
          .collection('Firends')
          .doc(curentUserID)
          .update({
            lastmessage: lastMessage,
          });
        navigation.navigate('Tabnavigate');
      }
    } else {
      navigation.navigate('Tabnavigate');
    }
  };

  const onGallaryPress = () => {
    setOpenModel(true);
  };

  const onClosePress = () => {
    setOpenModel(false);
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
      uploadImage(imageData);
      onClosePress();
    });
  };

  const uploadImage = async imageData => {
    const imagePath = imageData?.image;
    const reference = storage().ref(`${imagePath}`);
    const pathToFile = `${imagePath}`;
    await reference.putFile(pathToFile);

    const imageUrl = await storage()
      .ref(imagePath)
      .getDownloadURL()
      .then(url => {
        return url;
      });
    setImageUrl(imageUrl);
    await onSendSned(imageUrl);
  };

  const onVideoCallPress = async () => {
    if (group) {
      let CallId = uuid.v4();
      let notification = {
        title: currentUser?.name,
        body: 'Group Video Call',
        CallId: CallId,
        token: takeToken,
        Photo: group?.data?.Photo,
      };
      Notificationservice.sendMultiDiveceNotification(notification);
      navigation.navigate('Videocallscreen', {
        GroupCallerId: CallId,
      });
    } else {
      let CallId = uuid.v4();
      let notification = {
        title: currentUser?.name,
        body: 'Video Call',
        token: items?.Token,
        CallId: CallId,
        Photo: currentUser?.Photo,
      };
      await Notificationservice.sendSingleDiveceNotifiaction(notification);
      navigation.navigate('Videocallscreen', {
        CallerId: CallId,
      });
    }
  };

  const onVoiceCallPress = async () => {
    if (group) {
      let CallId = uuid.v4();
      let notification = {
        title: currentUser?.name,
        body: 'Group Voice Call',
        CallId: CallId,
        token: takeToken,
        Photo: group?.data?.Photo,
      };
      Notificationservice.sendMultiDiveceNotification(notification);
      navigation.navigate('Voicecallscreen', {
        GroupCallerId: CallId,
      });
    } else {
      let CallId = uuid.v4();
      let notification = {
        title: currentUser?.name,
        body: 'Voice Call',
        token: items?.Token,
        CallId: CallId,
        Photo: currentUser?.Photo,
      };
      Notificationservice.sendSingleDiveceNotifiaction(notification);
      navigation.navigate('Voicecallscreen', {
        CallerId: CallId,
      });
    }
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
            onPress={onClosePress}
          />
        </View>
      </Modal>
      {showChatScreen === true && (
        <View style={{flex: 1}}>
          <View style={style.headerStyle}>
            <View style={style.headerProfile}>
              <TouchableOpacity onPress={onBackPress}>
                <Image
                  source={ImageConst.arrow_png}
                  style={style.headerImage}
                />
              </TouchableOpacity>
              {group ? (
                <TouchableOpacity
                  onPress={onUserProfilePress}
                  style={{flexDirection: 'row'}}>
                  <Image
                    source={{uri: group?.data?.Photo}}
                    style={style.userProfile}
                  />
                  <Text style={style.messageFont}>
                    {group?.data?.GroupChat}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{flexDirection: 'row'}}
                  onPress={onUserProfilePress}>
                  <Image
                    source={{uri: items?.Photo}}
                    style={style.userProfile}
                  />
                  <View>
                    <Text style={style.messageFont}>{items?.name}</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginTop: hp(1),
              }}>
              <TouchableOpacity onPress={onVoiceCallPress}>
                <Image source={ImageConst.call_png} style={style.voiceCall} />
              </TouchableOpacity>
              <TouchableOpacity onPress={onVideoCallPress}>
                <Image source={ImageConst.zoom_png} style={style.videoCall} />
              </TouchableOpacity>
            </View>
          </View>
          <GiftedChat
            alwaysShowSend
            messages={messages}
            renderAvatar={null}
            renderUsernameOnMessage={true}
            onSend={messages => onSend(messages)}
            user={Users}
            renderBubble={props => {
              return (
                <Bubble
                  {...props}
                  wrapperStyle={{
                    left: {
                      backgroundColor: 'white',
                    },
                  }}
                />
              );
            }}
            renderSend={props => {
              return (
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity onPress={onGallaryPress}>
                    <Image
                      source={ImageConst.gallery_png}
                      style={{
                        width: 22,
                        height: 22,
                        marginBottom: 11,
                        marginRight: 15,
                      }}
                    />
                  </TouchableOpacity>
                  <Send
                    {...props}
                    sendButtonProps={{
                      style: {
                        marginRight: 5,
                      },
                    }}>
                    <Image
                      source={ImageConst.send_message_png}
                      style={{width: 24, height: 24}}
                    />
                  </Send>
                </View>
              );
            }}
            renderInputToolbar={props => {
              return (
                <InputToolbar
                  {...props}
                  containerStyle={{
                    marginHorizontal: 10,
                    borderRadius: 10,
                    marginTop: Platform.OS === 'ios' ? 30 : 0,
                    marginBottom: 5,
                  }}
                />
              );
            }}
          />
        </View>
      )}
      {showProfile === true && (
        <Userprofile items={items} Group={group} onPress={onUserProfilePress} />
      )}
    </View>
  );
};

const style = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  inputStyle: {
    flexDirection: 'row',
    borderWidth: 1,
    height: hp(5),
    marginHorizontal: wp(5),
    borderRadius: 15,
    marginVertical: 15,
  },
  messageSendBox: {
    backgroundColor: '#E0D5FE',
    marginTop: hp(3),
    marginLeft: wp(17),
    marginRight: wp(4),
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingVertical: 10,
  },
  headerStyle: {
    height: Platform.OS === 'ios' ? hp(14) : hp(12),
    backgroundColor: '#2B2D5E',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: Platform.OS === 'ios' ? 55 : 30,
  },
  messageFont: {
    fontSize: 20,
    color: 'white',
    marginLeft: 10,
    fontWeight: 'bold',
    marginLeft: 10,
    marginTop: 10,
  },
  headerImage: {
    height: 30,
    width: 30,
    tintColor: 'white',
    marginTop: 10,
  },
  userProfile: {
    height: hp(6.2),
    width: wp(14),
    borderRadius: 50,
    marginLeft: 20,
  },
  headerProfile: {
    flex: 1,
    flexDirection: 'row',
    width: wp(70),
  },
  latsSeen: {
    marginLeft: 30,
    color: 'white',
    marginTop: 5,
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
  voiceCall: {
    marginRight: wp(4),
    height: hp(3),
    width: wp(6.3),
    marginTop: hp(0.5),
    tintColor: 'white',
  },
  videoCall: {
    marginRight: wp(4),
    height: hp(4),
    width: wp(7),
    tintColor: 'white',
  },
});

export default Chatescreen;
