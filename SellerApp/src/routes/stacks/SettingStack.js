// * Import required modules/dependencies
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

// * Import all screens/components
import SettingScreen from '../../screens/primary/Setting';

// * Import all store related stuffs

// * Import utilites

// * Import all styling stuffs

const Stack = createStackNavigator();

const SettingStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}>
    <Stack.Screen
      name="setting-screen"
      component={SettingScreen}
      options={{
        title: 'Setting',
      }}
    />
  </Stack.Navigator>
);

export default SettingStack;
