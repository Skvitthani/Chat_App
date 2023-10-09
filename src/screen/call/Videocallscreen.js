import {useNavigation} from '@react-navigation/native';
import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import ZegoUIKitPrebuiltCall, {
  GROUP_VIDEO_CALL_CONFIG,
  ONE_ON_ONE_VIDEO_CALL_CONFIG,
} from '@zegocloud/zego-uikit-prebuilt-call-rn';

const Videocallscreen = ({route}) => {
  const CallerId = route?.params?.CallerId;
  const userName = route?.params?.userName;
  const GroupCallerId = route?.params?.GroupCallerId;

  const userID = String(Math.floor(Math.random() * 10000));

  const navigation = useNavigation();

  return (
    <View style={{flex: 1}}>
      {GroupCallerId ? (
        <ZegoUIKitPrebuiltCall
          appID={714082125}
          appSign={
            '6465c22dbca6bd082f4119c18d85c63587a464a2a3b72ef3525323ff3e8a9d8f'
          }
          userID={userID}
          userName={`${userID}`}
          callID={GroupCallerId}
          config={{
            ...GROUP_VIDEO_CALL_CONFIG,
            onOnlySelfInRoom: () => {
              navigation.navigate('Tabnavigate');
            },
            onHangUp: () => {
              navigation.navigate('Tabnavigate');
            },
            turnOnCameraWhenJoining: false,
            turnOnMicrophoneWhenJoining: true,
          }}
        />
      ) : (
        <ZegoUIKitPrebuiltCall
          appID={714082125}
          appSign={
            '6465c22dbca6bd082f4119c18d85c63587a464a2a3b72ef3525323ff3e8a9d8f'
          }
          userID={userID}
          userName={'userName'}
          callID={CallerId}
          config={{
            ...ONE_ON_ONE_VIDEO_CALL_CONFIG,
            onOnlySelfInRoom: () => {
              navigation.navigate('Tabnavigate');
            },
            onHangUp: () => {
              navigation.navigate('Tabnavigate');
            },

            turnOnCameraWhenJoining: false,
            turnOnMicrophoneWhenJoining: true,
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({});

export default Videocallscreen;
