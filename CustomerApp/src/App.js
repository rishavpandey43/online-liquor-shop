/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

// * Import required modules/dependencies
import React from 'react';
import {Provider} from 'react-redux';

// * Import all screens/components
import MainApp from './MainApp';

// * Import all store related stuffs
import store from './store/store';

// * Import utilites

// * Import all styling stuffs

const App = () => {
  return (
    <Provider store={store}>
      <MainApp />
    </Provider>
  );
};

export default App;
