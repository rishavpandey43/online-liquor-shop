// * Import required modules/dependencies
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

// * Import all screens/components
import ProductsScreen from '../../screens/primary/Products';
import ProductDetailScreen from '../../screens/secondary/ProductDetail';

// * Import all store related stuffs

// * Import utilites

// * Import all styling stuffs

const Stack = createStackNavigator();

const ProductsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}>
    <Stack.Screen
      name="products-screen"
      component={ProductsScreen}
      options={{
        title: 'Products',
      }}
    />
    <Stack.Screen
      name="product-detail-screen"
      component={ProductDetailScreen}
      options={{
        title: 'Product Detail',
      }}
    />
  </Stack.Navigator>
);

export default ProductsStack;
