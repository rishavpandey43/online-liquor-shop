// * Import required modules/dependencies
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

// * Import all screens/components
import HelpScreen from '../../screens/primary/Help';

// * Import all store related stuffs

// * Import utilites

// * Import all styling stuffs

const Stack = createStackNavigator();

const HelpStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}>
    <Stack.Screen
      name="help-screen"
      component={HelpScreen}
      options={{
        title: 'Help',
      }}
    />
  </Stack.Navigator>
);

export default HelpStack;
