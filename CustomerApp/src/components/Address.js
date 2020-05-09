// * Import required modules/dependencies
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-elements';
import {Icon} from 'react-native-elements';

// * Import all store related stuffs

// * Import all screens/components

// * Import utilites
import {getAddress} from '../utils/helper';

// * Import all styling stuffs
import mainStyles from '../styles/mainStyle';
import variables from '../styles/variables';

const Address = ({type, value}) => {
  return (
    <View
      style={{
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#cacaca',
        paddingBottom: 15,
      }}>
      <View style={mainStyles.row}>
        <View
          style={[
            mainStyles.col3,
            mainStyles.alignCenter,
            mainStyles.justifyContentCenter,
          ]}>
          <Icon
            name={getAddress(type).icon}
            type="font-awesome"
            color={variables.mainThemeColor}
            size={20}
          />
        </View>
        <View style={mainStyles.col9}>
          <Text style={styles.label}>{getAddress(type).name}</Text>
        </View>
      </View>
      <View style={[mainStyles.col9, {marginLeft: 'auto'}]}>
        <Text style={styles.content}>{value}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 22,
  },
  content: {
    marginTop: 10,
    fontSize: 18,
  },
  btn: {
    // backgroundColor: variables.mainThemeColor,
  },
});

export default Address;
