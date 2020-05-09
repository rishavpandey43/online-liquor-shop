// * Import required modules/dependencies
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

// * Import all screens/components
import AddNewProductScreen from '../../screens/primary/AddNewProduct';

// * Import all store related stuffs

// * Import utilites

// * Import all styling stuffs

const Stack = createStackNavigator();

const AddNewProductStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}>
    <Stack.Screen
      name="add-new-product-screen"
      component={AddNewProductScreen}
      options={{
        title: 'AddNewProduct',
      }}
    />
  </Stack.Navigator>
);

export default AddNewProductStack;
