import messaging from '@react-native-firebase/messaging';

export async function requestUserPermission() {
  const authorizationStatus = await messaging().requestPermission();

  if (authorizationStatus) {
  }
}
