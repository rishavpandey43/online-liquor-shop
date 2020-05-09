// * Import required modules/dependencies
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

// * Import all screens/components
import ProfileScreen from '../../screens/primary/Profile';
import UpdateProfileScreen from '../../screens/secondary/UpdateProfile';

// * Import all store related stuffs

// * Import utilites

// * Import all styling stuffs

const Stack = createStackNavigator();

const ProfileStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}>
    <Stack.Screen
      name="profile-screen"
      component={ProfileScreen}
      options={{
        title: 'Profile',
      }}
    />
    <Stack.Screen
      name="edit-profile-screen"
      component={UpdateProfileScreen}
      options={{
        title: 'Profile',
      }}
    />
  </Stack.Navigator>
);

export default ProfileStack;
