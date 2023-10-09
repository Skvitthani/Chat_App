import React, {useState} from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {LoginManager, AccessToken} from 'react-native-fbsdk-next';
import {sha256} from 'react-native-sha256';
import ImageCropPicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import messaging from '@react-native-firebase/messaging';
import {LoginComponent, SignUpComponent} from '../../components/Index';
import {hp, wp} from '../../utils/helper/globalfunction/Responsivefont';

const Signupscreen = ({navigation}) => {
  const [userEmail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [openModel, setOpenModel] = useState(false);
  const [image, setImage] = useState('');
  const [userLogin, setUserLogin] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [navigate, setNavigate] = useState(false);
  const [imagePath, setImagePath] = useState('');

  const onSignUpPress = async () => {
    const token = await messaging().getToken();

    const imagePath = image?.image;
    const reference = storage().ref(`${imagePath}`);
    setImagePath(reference?.path);
    const pathToFile = `${imagePath}`;
    await reference.putFile(pathToFile);

    if (
      userEmail !== '' &&
      password !== '' &&
      userName !== '' &&
      image !== ''
    ) {
      const result = await auth().createUserWithEmailAndPassword(
        userEmail,
        password,
      );
      const UID = result?.user?._user?.uid;
      const ImageUrl = await storage()
        .ref(imagePath)
        .getDownloadURL()
        .then(url => {
          return url;
        });
      firestore().collection('Users').doc(UID).set({
        Photo: ImageUrl,
        name: userName,
        email: userEmail,
        pass: password,
        userId: UID,
        Token: token,
      });
      setUserName('');
      setPassword('');
      setUserEmail('');
      navigation.navigate('Tabnavigate');
    } else {
      alert('Plz Fill Detail');
    }
  };

  const onSignInPress = async () => {
    await auth()
      .signInWithEmailAndPassword(userLogin, userPassword)
      .then(res => {
        navigation.navigate('Tabnavigate');
        setUserEmail('');
        setPassword('');
      })
      .catch(() => {
        alert('UserName And Password Not Valid!');
        setUserName('');
        setPassword('');
      });
  };

  GoogleSignin.configure({
    webClientId:
      '798564766973-v7ndiktul6qrjpdhessgj4a7up005r3j.apps.googleusercontent.com',
  });

  const onGoogleButtonPress = async () => {
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
    const {idToken} = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    navigation.navigate('Tabnavigate');
    return auth().signInWithCredential(googleCredential);
  };

  const onFacebookButtonPress = async () => {
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);
    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }
    const data = await AccessToken.getCurrentAccessToken();
    if (!data) {
      throw 'Something went wrong obtaining access token';
    }
    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken,
    );
    return auth().signInWithCredential(facebookCredential);
  };

  const onFacebookIosButtonPress = async () => {
    const nonce = '123456';
    const nonceSha256 = await sha256(nonce);
    const result = await LoginManager.logInWithPermissions(
      ['public_profile', 'email'],
      'limited',
      nonceSha256,
    );
    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }
    const data = await AuthenticationToken.getAuthenticationTokenIOS();
    if (!data) {
      throw 'Something went wrong obtaining authentication token';
    }
    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.authenticationToken,
      nonce,
    );
    return auth().signInWithCredential(facebookCredential);
  };

  const onOpenModelPress = () => {
    setOpenModel(true);
  };
  const onCloseModelPress = () => {
    setOpenModel(false);
  };
  const onSignUpNavigatePress = () => {
    setNavigate(true);
  };
  const onNavigatePress = () => {
    setNavigate(false);
  };

  const openGallary = async () => {
    ImageCropPicker.openPicker({
      width: wp(25),
      height: hp(17),
      cropping: true,
    }).then(image => {
      let imageData = {
        image: image.path,
      };

      setImage(imageData);
      // addImage();
      onCloseModelPress();
    });
  };

  return (
    <View style={style.mainView}>
      <View style={style.headerStyle}>
        <TouchableOpacity
          style={[
            {
              borderBottomWidth: navigate === true ? 2 : null,
              borderBottomColor: 'white',
              marginBottom: 2,
            },
          ]}
          onPress={onSignUpNavigatePress}>
          <Text style={{color: 'white', fontSize: 25}}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            {
              borderBottomWidth: navigate === false ? 2 : null,
              borderBottomColor: 'white',
              marginBottom: 2,
            },
          ]}
          onPress={onNavigatePress}>
          <Text style={{color: 'white', fontSize: 25}}>Sign In</Text>
        </TouchableOpacity>
      </View>

      {navigate === true ? (
        <SignUpComponent
          visible={openModel}
          onCloseModelPress={onCloseModelPress}
          onImageSlectPress={openGallary}
          ProfilePic={{uri: image?.image}}
          onOpenModelPress={onOpenModelPress}
          onSignUpPress={onSignUpPress}
          onFacebookButtonPress={onFacebookButtonPress}
          onFacebookIosButtonPress={onFacebookIosButtonPress}
          onGoogleButtonPress={onGoogleButtonPress}
          fullname={txt => setUserName(txt)}
          email={txt => setUserEmail(txt)}
          password={txt => setPassword(txt)}
        />
      ) : (
        <LoginComponent
          onFacebookButtonPress={onFacebookButtonPress}
          onFacebookIosButtonPress={onFacebookIosButtonPress}
          onGoogleButtonPress={onGoogleButtonPress}
          Pass={txt => setUserPassword(txt)}
          userName={txt => setUserLogin(txt)}
          onSignInPress={onSignInPress}
        />
      )}
      {navigate === true ? (
        <View style={style.footerStyle} />
      ) : (
        <View style={style.footerStyle1} />
      )}
    </View>
  );
};

const style = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  headerStyle: {
    height: Platform.OS === 'ios' ? hp(20) : hp(15),
    borderBottomEndRadius: 30,
    borderBottomStartRadius: 30,

    backgroundColor: '#2B2D5E',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-evenly',
  },
  footerStyle: {
    backgroundColor: '#2B2D5E',
    height: 70,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
  },
  footerStyle1: {
    backgroundColor: '#2B2D5E',
    height: 100,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    marginTop: 195,
  },
});

export default Signupscreen;
