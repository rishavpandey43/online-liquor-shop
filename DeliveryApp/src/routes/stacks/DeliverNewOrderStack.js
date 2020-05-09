// * Import required modules/dependencies
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

// * Import all screens/components
import DeliverNewOrder from '../../screens/primary/DeliverNewOrder';

// * Import all store related stuffs

// * Import utilites

// * Import all styling stuffs

const Stack = createStackNavigator();

const DeliverNewOrderStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}>
    <Stack.Screen
      name="deliver-new-order-screen"
      component={DeliverNewOrder}
      options={{
        title: 'Help',
      }}
    />
  </Stack.Navigator>
);

export default DeliverNewOrderStack;
