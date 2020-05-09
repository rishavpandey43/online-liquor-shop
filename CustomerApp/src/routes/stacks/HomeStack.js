// * Import required modules/dependencies
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

// * Import all screens/components
import HomeScreen from '../../screens/primary/Home';
import UpdateProfileScreen from '../../screens/secondary/UpdateProfile';
import StoreDetailScreen from '../../screens/secondary/StoreDetail';
import CartScreen from '../../screens/secondary/Cart';
import CheckoutScreen from '../../screens/secondary/Checkout';
import OrderConfirmationScreen from '../../screens/secondary/OrderConfirmation';

// * Import all store related stuffs

// * Import utilites

// * Import all styling stuffs

const Stack = createStackNavigator();

const HomeStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}>
    <Stack.Screen
      name="home-screen"
      component={HomeScreen}
      options={{
        title: 'Home',
      }}
    />
    <Stack.Screen
      name="update-profile-screen"
      component={UpdateProfileScreen}
      options={{
        title: 'Update Profile',
      }}
    />
    <Stack.Screen
      name="store-detail-screen"
      component={StoreDetailScreen}
      options={{
        title: 'Store Detail',
      }}
    />
    <Stack.Screen
      name="cart-screen"
      component={CartScreen}
      options={{
        title: 'Cart Detail',
      }}
    />
    <Stack.Screen
      name="checkout-screen"
      component={CheckoutScreen}
      options={{
        title: 'Checkout',
      }}
    />
    <Stack.Screen
      name="order-confirmation-screen"
      component={OrderConfirmationScreen}
      options={{
        title: 'Order Confirmation',
      }}
    />
  </Stack.Navigator>
);

export default HomeStack;
