// * Import required modules/dependencies
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {
  ScrollView,
  StyleSheet,
  View,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import {Header, Card, Text, Icon, Button} from 'react-native-elements';
import axios from 'axios';

// * Import all store related stuffs
import * as OrderActions from '../../store/actions/creators/OrdersActions';

// * Import all screens/components
import Item from '../../components/OrderItem';

// * Import utilites
import {baseUrl} from '../../utils/constant';
import {
  getOrderStatus,
  getpaymentMode,
  obtainAddressInString,
} from '../../utils/helper';

// * Import all styling stuffs
import mainStyles from '../../styles/mainStyle';
import variables from '../../styles/variables';

class OrderDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      order: null,
    };
  }

  componentDidMount() {
    if (this.props.route.params) {
      this.setState({
        order: this.props.orders.orders.filter(
          order => order._id === this.props.route.params.orderId,
        )[0],
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.orders.orders.filter(
        order => order._id === this.props.route.params.orderId,
      )[0].status !==
      this.props.orders.orders.filter(
        order => order._id === this.props.route.params.orderId,
      )[0].status
    ) {
      this.setState({
        order: this.props.orders.orders.filter(
          order => order._id === this.props.route.params.orderId,
        )[0],
      });
    }
  }

  _processOrder = processType => {
    Alert.alert(
      'Confirm your choice',
      `Have you ${
        processType === 'ofd' ? 'Picked Up' : 'Delivered'
      }  this order?`,
      [
        {
          text: 'Cancel',
          onPress: () => {
            return;
          },
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            this.props.processOrderFetch(
              this.props.auth.authToken,
              processType,
              this.state.order._id,
            );
          },
        },
      ],
    );
  };

  render() {
    return (
      <View>
        <Header
          leftComponent={
            <Icon
              type="font-awesome"
              name="arrow-left"
              size={20}
              color="#FFF"
              underlayColor="transparent"
              onPress={() => {
                this.props.navigation.goBack();
              }}
            />
          }
          centerComponent={{
            text: `ORDER #${this.state.order ? this.state.order._id : ''}`,
            style: {color: '#fff'},
          }}
          containerStyle={{
            backgroundColor: '#933dd4',
            justifyContent: 'space-around',
          }}
        />
        <ScrollView>
          {!this.state.order ? (
            <ActivityIndicator />
          ) : (
            <View style={[mainStyles.container, {marginBottom: 100}]}>
              <Card
                title="Take your action regarding this order"
                containerStyle={{
                  display: `${
                    this.state.order.status === 'prc' ||
                    this.state.order.status === 'prcd' ||
                    this.state.order.status === 'ofd'
                      ? 'flex'
                      : 'none'
                  }`,
                }}>
                <Text style={{textAlign: 'center', fontSize: 18}}>
                  {this.state.order.status === 'prc' ? (
                    <Text>
                      Order is still under process by seller, please wait.
                    </Text>
                  ) : (
                    `Have you ${
                      this.state.order.status === 'prcd'
                        ? 'Picked up'
                        : 'Delivered'
                    }  this order?`
                  )}
                </Text>
                {this.state.order.status === 'prcd' ? (
                  <View style={{marginTop: 20, alignItems: 'center'}}>
                    <View style={mainStyles.col6}>
                      <Button
                        title="Yes"
                        type="outline"
                        raised
                        loading={this.props.orders.updatingOrder_other}
                        titleStyle={{color: variables.mainThemeColor}}
                        buttonStyle={mainStyles.outlineBtn}
                        onPress={this._processOrder.bind(null, 'ofd')}
                      />
                    </View>
                  </View>
                ) : null}
                {this.state.order.status === 'ofd' ? (
                  <View style={{marginTop: 20, alignItems: 'center'}}>
                    <View style={mainStyles.col6}>
                      <Button
                        title="Yes"
                        type="outline"
                        raised
                        loading={this.props.orders.updatingOrder_other}
                        titleStyle={{color: variables.mainThemeColor}}
                        buttonStyle={mainStyles.outlineBtn}
                        onPress={this._processOrder.bind(null, 'del')}
                      />
                    </View>
                  </View>
                ) : null}
              </Card>

              <Card title="Order Summary">
                <View style={{flex: 1, flexDirection: 'row', marginBottom: 20}}>
                  <View style={{flex: 1}}>
                    <Text style={styles.label}>Status:</Text>
                  </View>
                  <View style={{flex: 1, justifyContent: 'center'}}>
                    <Text
                      style={{
                        fontSize: 18,
                        color: getOrderStatus(this.state.order.status).color,
                      }}>
                      {getOrderStatus(this.state.order.status).label}
                    </Text>
                  </View>
                </View>

                <Text style={{fontSize: 20, marginBottom: 20}}>
                  Items in order:
                </Text>

                <View>
                  {this.state.order.items.map((item, i) => (
                    <Item
                      key={i}
                      name={item.name}
                      variant={item.value}
                      quantity={item.quantity}
                      price={item.price}
                    />
                  ))}
                </View>

                <View style={{flex: 1, flexDirection: 'row', marginTop: 20}}>
                  <View style={{flex: 1}}>
                    <Text>Item Total:</Text>
                  </View>
                  <View style={{flex: 1}}>
                    <Text style={{textAlign: 'right'}}>
                      ₹ {this.state.order.amount.itemsPrice}
                    </Text>
                  </View>
                </View>

                <View style={{flex: 1, flexDirection: 'row', marginTop: 20}}>
                  <View style={{flex: 1}}>
                    <Text>Delivery Charge:</Text>
                  </View>
                  <View style={{flex: 1}}>
                    <Text style={{textAlign: 'right'}}>
                      ₹ {this.state.order.amount.deliveryCharge}
                    </Text>
                  </View>
                </View>

                <View style={{flex: 1, flexDirection: 'row', marginTop: 20}}>
                  <View style={{flex: 1}}>
                    <Text>Payment Mode:</Text>
                  </View>
                  <View style={{flex: 1}}>
                    <Text style={{textAlign: 'right'}}>
                      {getpaymentMode(this.state.order.paymentMode)}
                    </Text>
                  </View>
                </View>
                <View style={{flex: 1, flexDirection: 'row', marginTop: 20}}>
                  <View style={{flex: 1}}>
                    <Text>Payment Status:</Text>
                  </View>
                  <View style={{flex: 1}}>
                    <Text style={{textAlign: 'right'}}>
                      {this.state.order.status === 'del'
                        ? 'Completed'
                        : this.state.order.paymentMode === 'cod'
                        ? 'Pending'
                        : 'Completed'}
                    </Text>
                  </View>
                </View>
              </Card>

              <Card title="Customer Detail">
                <View style={{flex: 1, flexDirection: 'row', marginBottom: 20}}>
                  <View style={{flex: 1}}>
                    <Text style={styles.label}>Name:</Text>
                  </View>
                  <View style={{flex: 1, justifyContent: 'center'}}>
                    <Text style={{fontSize: 18}}>
                      {this.state.order.orderedBy.personalDetail.firstName +
                        ' ' +
                        this.state.order.orderedBy.personalDetail.lastName}
                    </Text>
                  </View>
                </View>

                <View style={{flex: 1, flexDirection: 'row', marginBottom: 20}}>
                  <View style={{flex: 1}}>
                    <Text style={styles.label}>Contact number:</Text>
                  </View>
                  <View style={{flex: 1, justifyContent: 'center'}}>
                    <Text
                      style={{
                        fontSize: 18,
                        textDecorationLine: 'underline',
                      }}
                      onPress={() => {
                        Linking.openURL(
                          `tel:${
                            this.state.order.orderedBy.personalDetail.phone
                          }`,
                        );
                      }}>
                      {this.state.order.orderedBy.personalDetail.phone}
                    </Text>
                  </View>
                </View>

                <View style={{flex: 1, flexDirection: 'row', marginBottom: 20}}>
                  <View style={{flex: 1}}>
                    <Text style={styles.label}>Address:</Text>
                  </View>
                  <View style={{flex: 1, justifyContent: 'center'}}>
                    <Text style={{fontSize: 18}}>
                      {obtainAddressInString(
                        this.state.order.orderedBy.address,
                      )}
                    </Text>
                  </View>
                </View>
              </Card>

              <Card title="Seller Detail">
                <View style={{flex: 1, flexDirection: 'row', marginBottom: 20}}>
                  <View style={{flex: 1}}>
                    <Text style={styles.label}>Store name:</Text>
                  </View>
                  <View style={{flex: 1, justifyContent: 'center'}}>
                    <Text style={{fontSize: 18}}>
                      {this.state.order.orderedFrom.storeDetail.name}
                    </Text>
                  </View>
                </View>

                <View style={{flex: 1, flexDirection: 'row', marginBottom: 20}}>
                  <View style={{flex: 1}}>
                    <Text style={styles.label}>Seller name:</Text>
                  </View>
                  <View style={{flex: 1, justifyContent: 'center'}}>
                    <Text style={{fontSize: 18}}>
                      {this.state.order.orderedFrom.personalDetail.firstName +
                        ' ' +
                        this.state.order.orderedFrom.personalDetail.lastName}
                    </Text>
                  </View>
                </View>

                <View style={{flex: 1, flexDirection: 'row', marginBottom: 20}}>
                  <View style={{flex: 1}}>
                    <Text style={styles.label}>Seller contact number:</Text>
                  </View>
                  <View style={{flex: 1, justifyContent: 'center'}}>
                    <Text
                      style={{
                        fontSize: 18,
                        textDecorationLine: 'underline',
                      }}
                      onPress={() => {
                        Linking.openURL(
                          `tel:${
                            this.state.order.orderedFrom.personalDetail.phone
                          }`,
                        );
                      }}>
                      {this.state.order.orderedFrom.personalDetail.phone}
                    </Text>
                  </View>
                </View>

                <View style={{flex: 1, flexDirection: 'row', marginBottom: 20}}>
                  <View style={{flex: 1}}>
                    <Text style={styles.label}>Address:</Text>
                  </View>
                  <View style={{flex: 1, justifyContent: 'center'}}>
                    <Text style={{fontSize: 18}}>
                      {obtainAddressInString(
                        this.state.order.orderedFrom.storeDetail.address,
                      )}
                    </Text>
                  </View>
                </View>
              </Card>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  label: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

const mapStateToProps = state => {
  return {
    auth: state.auth,
    orders: state.orders,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({...OrderActions}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OrderDetailScreen);
