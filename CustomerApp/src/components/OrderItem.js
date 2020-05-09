// * Import required modules/dependencies
import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-elements';

// * Import all store related stuffs

// * Import all screens/components

// * Import utilites

// * Import all styling stuffs

const Item = ({name, variant, quantity, price}) => {
  return (
    <View
      style={[
        {
          flex: 1,
          flexDirection: 'row',
          marginBottom: 10,
          borderBottomWidth: 1,
          borderBottomColor: '#cacaca',
          paddingBottom: 15,
        },
      ]}>
      <View style={{flex: 1}}>
        <Text style={{fontSize: 18}}>{name}</Text>
        <Text style={{color: '#aaaaaa'}}>{variant}</Text>
      </View>
      <View style={{flex: 1}}>
        <Text style={{textAlign: 'right'}}>Qty: {quantity}</Text>
      </View>
      <View style={{flex: 1}}>
        <Text style={{textAlign: 'right'}}>₹ {quantity * price}</Text>
      </View>
    </View>
  );
};
export default Item;
