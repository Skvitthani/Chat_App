import RNCallKeep from 'react-native-callkeep';

const rnCallKeep = () => {
  const options = {
    ios: {
      appName: 'Chatedemo',
    },
    android: {
      alertTitle: 'Permissions required',
      alertDescription: 'This application needs to access your phone accounts',
      cancelButton: 'Cancel',
      okButton: 'ok',
      // Required to get audio in background when using Android 11
      foregroundService: {
        channelId: 'com.Chatedemo.my',
        channelName: 'Foreground service for my app',
        notificationTitle: 'My app is running on background',
        notificationIcon: 'Path to the resource icon of the notification',
      },
    },
  };

  RNCallKeep.setup(options).then();
  RNCallKeep.setAvailable(true);
};

export default rnCallKeep;
