// * Import required modules/dependencies
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, Button, Card} from 'react-native-elements';

// * Import all store related stuffs

// * Import all screens/components

// * Import utilites
import {getOrderStatus} from '../utils/helper';

// * Import all styling stuffs
import mainStyles from '../styles/mainStyle';
import variables from '../styles/variables';

const OrderCard = ({order, navigation}) => {
  return (
    <Card containerStyle={{borderRadius: 10}}>
      <View style={mainStyles.row}>
        <View style={mainStyles.col6}>
          <View>
            <Text style={styles.title}>Order Date</Text>
            <Text>{new Date(order.createdAt).toDateString().toString()}</Text>
          </View>
          <View style={styles.marginTop}>
            <Text
              style={{
                color: getOrderStatus(order.status).color,
                fontSize: 18,
              }}>
              {getOrderStatus(order.status).label}
            </Text>
          </View>
        </View>
        <View style={mainStyles.col6}>
          <View>
            <Text style={styles.title}>Order Id</Text>
            <Text>#{order._id}</Text>
          </View>
          <View style={styles.marginTop}>
            <Button
              title="View Details"
              type="outline"
              raised
              titleStyle={{color: variables.mainThemeColor}}
              buttonStyle={mainStyles.outlineBtn}
              onPress={() => {
                navigation.navigate('order-detail-screen', {
                  orderId: order._id,
                });
              }}
            />
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  marginTop: {
    marginTop: 25,
  },
});

export default OrderCard;
