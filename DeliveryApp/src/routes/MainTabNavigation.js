// * Import required modules/dependencies
import React from 'react';
import {Icon} from 'react-native-elements';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

// * Import all screens/components
import RegisterScreen from '../screens/primary/Register';
import LoginScreen from '../screens/primary/Login';

// * Import all store related stuffs

// * Import utilites

// * Import all styling stuffs
import variables from '../styles/variables.js';

const Tab = createBottomTabNavigator();

const MainTabNavigation = () => (
  <NavigationContainer>
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'register-screen') {
            iconName = 'user-plus';
          } else if (route.name === 'login-screen') {
            iconName = 'home';
          }

          // You can return any component that you like here!
          return (
            <Icon
              name={iconName}
              type="font-awesome"
              size={size}
              color={color}
            />
          );
        },
      })}
      tabBarOptions={{
        activeTintColor: variables.mainThemeColor,
        inactiveTintColor: 'gray',
        labelStyle: {fontSize: 18},
      }}>
      <Tab.Screen
        name="login-screen"
        component={LoginScreen}
        options={{
          tabBarLabel: 'Login',
        }}
      />
      <Tab.Screen
        name="register-screen"
        component={RegisterScreen}
        options={{
          tabBarLabel: 'Register',
        }}
      />
    </Tab.Navigator>
  </NavigationContainer>
);

export default MainTabNavigation;
