// * Import required modules/dependencies
import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {View, TouchableOpacity, ActivityIndicator} from 'react-native';
import {Text, Image} from 'react-native-elements';

// * Import all store related stuffs
import * as StoreActions from '../store/actions/creators/StoreActions';

// * Import all screens/components

// * Import utilites
import {obtainAddressInString} from '../utils/helper';

// * Import all styling stuffs
import mainStyles from '../styles/mainStyle';

const Store = ({selectStore, sellers, currentStore, navigation}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        selectStore({
          ...sellers.sellers.filter(
            seller => seller._id === currentStore._id,
          )[0],
        });
        navigation.navigate('store-detail-screen');
      }}>
      <View style={[mainStyles.row, {marginTop: 10, marginBottom: 10}]}>
        <View style={mainStyles.col4}>
          <Image
            source={{uri: 'https://via.placeholder.com/100'}}
            style={{width: 100, height: 100}}
            PlaceholderContent={<ActivityIndicator />}
          />
        </View>
        <View style={mainStyles.col8}>
          <Text style={{fontSize: 18}}>{currentStore.storeDetail.name}</Text>
          <Text style={{color: '#555'}}>
            {obtainAddressInString(currentStore.storeDetail.address)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const mapStateToProps = state => {
  return {
    sellers: state.sellers,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({...StoreActions}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Store);
