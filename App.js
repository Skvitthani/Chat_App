import React, {useEffect} from 'react';
import {Alert} from 'react-native';
import {Provider} from 'react-redux';
import Navigate from './src/navigation/Navigate';
import messaging from '@react-native-firebase/messaging';
import {navigate} from './src/navigation/NavigateRef';
import notifee, {EventType} from '@notifee/react-native';
import Customnotifee from './src/utils/notification/Customnotifee';
import {myStore} from './src/redux/store/Store';

const App = () => {
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      if (remoteMessage?.data?.body === 'Sent Request') {
        Alert.alert('request', `From ${remoteMessage?.data?.title}`, [
          {
            text: 'Reject',
            style: 'cancel',
          },
          {
            text: 'Accept',
            onPress: () => navigate('Notificationscreen'),
          },
        ]);
      } else {
        if (remoteMessage?.data?.body == 'Voice Call') {
          Alert.alert('Voice Call', `From ${remoteMessage?.data?.title}`, [
            {
              text: 'Reject',
              style: 'cancel',
            },
            {
              text: 'Accept',
              onPress: () =>
                navigate('Voicecallscreen', {
                  CallerId: remoteMessage?.data?.CallId,
                }),
            },
          ]);
        } else if (remoteMessage?.data?.body == 'Video Call') {
          Alert.alert('Video Call', `From ${remoteMessage?.data?.title}`, [
            {
              text: 'Reject',
              style: 'cancel',
            },
            {
              text: 'Accept',
              onPress: () =>
                navigate('Videocallscreen', {
                  CallerId: remoteMessage?.data?.CallId,
                }),
            },
          ]);
        } else if (remoteMessage?.data?.body == 'Group Voice Call') {
          Alert.alert(
            'Group Voice Call',
            `From ${remoteMessage?.data?.title}`,
            [
              {
                text: 'Reject',
                style: 'cancel',
              },
              {
                text: 'Accept',
                onPress: () =>
                  navigate('Voicecallscreen', {
                    GroupCallerId: remoteMessage?.data?.CallId,
                  }),
              },
            ],
          );
        } else {
          Alert.alert(
            'Group Video Call',
            `From ${remoteMessage?.data?.title}`,
            [
              {
                text: 'Reject',
                style: 'cancel',
              },
              {
                text: 'Accept',
                onPress: () =>
                  navigate('Videocallscreen', {
                    GroupCallerId: remoteMessage?.data?.CallId,
                  }),
              },
            ],
          );
        }
      }
    });
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      if (remoteMessage?.data?.body === 'Sent Request') {
        Customnotifee.requestNotification(
          `${remoteMessage?.data?.title}`,
          `${remoteMessage?.data?.body}`,
          `${remoteMessage?.data?.Photo}`,
        );
        notifee.onBackgroundEvent(async ({type, detail}) => {
          const {notification, pressAction} = detail;
          if (type === EventType.ACTION_PRESS && pressAction.id === 'Accept') {
            navigate('Notificationscreen');
          }
        });
      } else {
        Customnotifee.Customnotifee(
          `${remoteMessage?.data?.body}`,
          `${remoteMessage?.data?.title}`,
          `${remoteMessage?.data?.Photo}`,
          `${remoteMessage?.data?.CallId}`,
        );
        notifee.onBackgroundEvent(async ({type, detail}) => {
          const {notification, pressAction} = detail;
          if (
            type === EventType.ACTION_PRESS &&
            pressAction.id === 'Accept' &&
            detail?.notification?.title === 'Video Call'
          ) {
            navigate('Videocallscreen', {
              CallerId: detail?.notification?.data?.title,
            });
          } else if (
            type === EventType.ACTION_PRESS &&
            pressAction.id === 'Accept' &&
            detail?.notification?.title === 'Voice Call'
          ) {
            navigate('Voicecallscreen', {
              CallerId: detail?.notification?.data?.title,
            });
          } else if (
            type === EventType.ACTION_PRESS &&
            pressAction.id === 'Accept' &&
            detail?.notification?.title === 'Group Voice Call'
          ) {
            navigate('Voicecallscreen', {
              GroupCallerId: detail?.notification?.data?.title,
            });
          } else if (
            type === EventType.ACTION_PRESS &&
            pressAction.id === 'Accept' &&
            detail?.notification?.title === 'Group Video Call'
          ) {
            navigate('Videocallscreen', {
              GroupCallerId: detail?.notification?.data?.title,
            });
          }
        });
      }
    });
    return unsubscribe;
  }, []);

  return (
    <Provider store={myStore}>
      <Navigate />
    </Provider>
  );
};

export default App;
