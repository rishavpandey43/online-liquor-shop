// * Import required modules/dependencies
import React from 'react';
import {Icon} from 'react-native-elements';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';

// * Import all screens/components
import DashBoardStack from './stacks/DashBoardStack';
import ProfileStack from './stacks/ProfileStack';
import ProductsStack from './stacks/ProductsStack';
import AddNewProductStack from './stacks/AddNewProductStack';
import OrdersStack from './stacks/OrdersStack';
import HelpStack from './stacks/HelpStack';
import SettingStack from './stacks/SettingStack';

// * Import all store related stuffs

// * Import utilites

// * Import all styling stuffs
import variable from '../styles/variables.js';

const Drawer = createDrawerNavigator();

const MainDrawerNavigation = () => (
  <NavigationContainer>
    <Drawer.Navigator>
      <Drawer.Screen
        name="dashBoard-stack"
        component={DashBoardStack}
        options={{
          drawerLabel: 'Dashboard',
          drawerIcon: () => (
            <Icon
              name="dashboard"
              type="font-awesome"
              size={30}
              color={variable.mainThemeColor}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="profile-stack"
        component={ProfileStack}
        options={{
          drawerLabel: 'Profile',
          drawerIcon: () => (
            <Icon
              name="user"
              type="font-awesome"
              size={30}
              color={variable.mainThemeColor}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="products-stack"
        component={ProductsStack}
        options={{
          drawerLabel: 'Products',
          drawerIcon: () => (
            <Icon
              name="product-hunt"
              type="font-awesome"
              size={30}
              color={variable.mainThemeColor}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="add-new-product-stack"
        component={AddNewProductStack}
        options={{
          drawerLabel: 'Add New Product',
          drawerIcon: () => (
            <Icon
              name="plus"
              type="font-awesome"
              size={30}
              color={variable.mainThemeColor}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="orders-stack"
        component={OrdersStack}
        options={{
          drawerLabel: 'Orders',
          drawerIcon: () => (
            <Icon
              name="reorder"
              type="font-awesome"
              size={30}
              color={variable.mainThemeColor}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="help-stack"
        component={HelpStack}
        options={{
          drawerLabel: 'Help',
          drawerIcon: () => (
            <Icon
              name="question"
              type="font-awesome"
              size={30}
              color={variable.mainThemeColor}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="setting-stack"
        component={SettingStack}
        options={{
          drawerLabel: 'Setting',
          drawerIcon: () => (
            <Icon
              name="cogs"
              type="font-awesome"
              size={30}
              color={variable.mainThemeColor}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  </NavigationContainer>
);

export default MainDrawerNavigation;
