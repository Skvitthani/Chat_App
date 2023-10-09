import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import Chatescreen from '../screen/chat/Chatescreen';
import Signupscreen from '../screen/auth/Signupscreen';
import {navigationRef} from './NavigateRef';
import Groupscreen from '../screen/group/Groupscreen';
import Creategroup from '../screen/group/Creategroup';
import Tabnavigate from './Tabnavigate';
import Notificationscreen from '../screen/coman/Notificationscreen';
import Videocallscreen from '../screen/call/Videocallscreen';
import Voicecallscreen from '../screen/call/Voicecallscreen';
import Settingscreen from '../screen/coman/Settingscreen';
import Userlistscreen from '../screen/coman/Userlistscreen';
import Statusshowscreen from '../screen/coman/Statushowscreen';
import Addgroupmemberscreen from '../screen/group/Addgroupmemberscreen';

const stack = createNativeStackNavigator();

const Navigate = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <stack.Navigator 
      >
        <stack.Screen
          name="Tabnavigate"
          component={Tabnavigate}
          options={{headerShown: false}}
        />
        <stack.Screen
          name="Signupscreen"
          component={Signupscreen}
          options={{headerShown: false}}
        />
        <stack.Screen
          name="Chatescreen"
          component={Chatescreen}
          options={{headerShown: false}}
        />
        <stack.Screen
          name="Groupscreen"
          component={Groupscreen}
          options={{headerShown: false}}
        />
        <stack.Screen
          name="Creategroup"
          component={Creategroup}
          options={{headerShown: false}}
        />
        <stack.Screen
          name="Settingscreen"
          component={Settingscreen}
          options={{headerShown: false}}
        />
        <stack.Screen
          name="Userlistscreen"
          component={Userlistscreen}
          options={{headerShown: false}}
        />
        <stack.Screen
          name="Notificationscreen"
          component={Notificationscreen}
          options={{headerShown: false}}
        />
        <stack.Screen
          name="Voicecallscreen"
          component={Voicecallscreen}
          options={{headerShown: false}}
        />
        <stack.Screen
          name="Videocallscreen"
          component={Videocallscreen}
          options={{headerShown: false}}
        />
        <stack.Screen
          name="Statusshowscreen"
          component={Statusshowscreen}
          options={{headerShown: false}}
        />
        <stack.Screen
          name="Addgroupmemberscreen"
          component={Addgroupmemberscreen}
          options={{headerShown: false}}
        />
      </stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigate;
