// * Import required modules/dependencies
import React from 'react';
import {Icon} from 'react-native-elements';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';

// * Import all screens/components
import DashBoardStack from './stacks/DashBoardStack';
import ProfileStack from './stacks/ProfileStack';
import DeliverNewOrderStack from './stacks/DeliverNewOrderStack';
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
        name="deliver-new-order-stack"
        component={DeliverNewOrderStack}
        options={{
          drawerLabel: 'Deliver New Order',
          drawerIcon: () => (
            <Icon
              name="shopping-bag"
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
