import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, Alert, View} from 'react-native';
import ZegoUIKitPrebuiltCall, {
  GROUP_VOICE_CALL_CONFIG,
  ONE_ON_ONE_VOICE_CALL_CONFIG,
} from '@zegocloud/zego-uikit-prebuilt-call-rn';

const Voicecallscreen = ({route}) => {
  const navigation = useNavigation();

  const CallerId = route?.params?.CallerId;
  const userName = route?.params?.userName;

  const userID = String(Math.floor(Math.random() * 10000));

  const GroupCallerId = route?.params?.GroupCallerId;
  return (
    <View style={styles.container}>
      {CallerId ? (
        <ZegoUIKitPrebuiltCall
          appID={714082125}
          appSign={
            '6465c22dbca6bd082f4119c18d85c63587a464a2a3b72ef3525323ff3e8a9d8f'
          }
          userID={userID}
          userName={'userName'}
          callID={CallerId}
          config={{
            ...ONE_ON_ONE_VOICE_CALL_CONFIG,
            onOnlySelfInRoom: () => {
              navigation.navigate('Tabnavigate');
            },
            onHangUp: () => {
              navigation.navigate('Tabnavigate');
            },
          }}
        />
      ) : (
        <ZegoUIKitPrebuiltCall
          appID={714082125}
          appSign={
            '6465c22dbca6bd082f4119c18d85c63587a464a2a3b72ef3525323ff3e8a9d8f'
          }
          userID={userID}
          userName={'AB'}
          callID={GroupCallerId}
          config={{
            ...GROUP_VOICE_CALL_CONFIG,
            onOnlySelfInRoom: () => {
              navigation.navigate('Tabnavigate');
            },
            onHangUp: () => {
              navigation.navigate('Tabnavigate');
            },
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Voicecallscreen;
