// * Import required modules/dependencies
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

// * Import all screens/components
import FavoriteScreen from '../../screens/primary/Favorite';

// * Import all store related stuffs

// * Import utilites

// * Import all styling stuffs

const Stack = createStackNavigator();

const FavoriteStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}>
    <Stack.Screen
      name="favorite-screen"
      component={FavoriteScreen}
      options={{
        title: 'My Favorite',
      }}
    />
  </Stack.Navigator>
);

export default FavoriteStack;
