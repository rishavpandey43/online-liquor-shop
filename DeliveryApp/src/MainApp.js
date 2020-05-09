// * Import required modules/dependencies
import React, {useEffect} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import messaging from '@react-native-firebase/messaging';

// * Import all screens/components
import MainTabNavigation from './routes/MainTabNavigation';
import MainDrawerNavigation from './routes/MainDrawerNavigation';

// * Import all store related stuffs

// * Import utilites

// * Import all styling stuffs

const MainApp = ({auth}) => {
  useEffect(() => {
    permissionStatus
      .then(res => {})
      .catch(err => {
        permissionGranted
          .then(res => {})
          .catch(err => {
            console.log('User canceled the permission');
          });
      });
  }, []);

  const permissionStatus = messaging().hasPermission();
  const permissionGranted = messaging().requestPermission();

  return auth.isAuthenticated ? (
    <MainDrawerNavigation />
  ) : (
    <MainTabNavigation />
  );
};

const mapStateToProps = state => {
  return {
    profile: state.profile,
    auth: state.auth,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MainApp);
