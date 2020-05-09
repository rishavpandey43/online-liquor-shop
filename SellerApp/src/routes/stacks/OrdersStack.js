// * Import required modules/dependencies
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

// * Import all screens/components
import OrdersScreen from '../../screens/primary/Orders';
import OrderDetailScreen from '../../screens/secondary/OrderDetail';

// * Import all store related stuffs

// * Import utilites

// * Import all styling stuffs

const Stack = createStackNavigator();

const OrdersStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}>
    <Stack.Screen
      name="orders-screen"
      component={OrdersScreen}
      options={{
        title: 'Orders',
      }}
    />
    <Stack.Screen
      name="order-detail-screen"
      component={OrderDetailScreen}
      options={{
        title: 'Order Detail',
      }}
    />
  </Stack.Navigator>
);

export default OrdersStack;
