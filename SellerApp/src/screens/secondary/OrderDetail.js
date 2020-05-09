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
} from 'react-native';
import {Header, Card, Text, Icon, Button} from 'react-native-elements';

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
      orderUpdating_No: false,
      orderUpdating_Yes: false,
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

  _proceedOrder = processType => {
    Alert.alert(
      'Confirm your choice',
      `${
        processType === 'can'
          ? 'Do you want to Cancel this order?'
          : processType === 'prc'
          ? 'Do you want to process this order?'
          : 'Have you Processed this order?'
      }`,
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
                    this.state.order.status === 'pen' ||
                    this.state.order.status === 'prc'
                      ? 'flex'
                      : 'none'
                  }`,
                }}>
                <Text style={{textAlign: 'center', fontSize: 18}}>
                  {this.state.order.status === 'pen'
                    ? 'Do you want to process this order?'
                    : 'Have you processed this order?'}
                </Text>
                {this.state.order.status === 'pen' ? (
                  <View style={[mainStyles.row, {marginTop: 20}]}>
                    <View style={mainStyles.col6}>
                      <Button
                        title="No"
                        type="outline"
                        raised
                        loading={this.props.orders.updatingOrder_can}
                        titleStyle={{color: variables.mainThemeColor}}
                        buttonStyle={mainStyles.outlineBtn}
                        onPress={this._proceedOrder.bind(null, 'can')}
                      />
                    </View>
                    <View style={mainStyles.col6}>
                      <Button
                        title="Yes"
                        type="outline"
                        raised
                        loading={this.props.orders.updatingOrder_other}
                        titleStyle={{color: variables.mainThemeColor}}
                        buttonStyle={mainStyles.outlineBtn}
                        onPress={this._proceedOrder.bind(null, 'prc')}
                      />
                    </View>
                  </View>
                ) : this.state.order.status === 'prc' ? (
                  <View style={{marginTop: 20, alignItems: 'center'}}>
                    <View style={mainStyles.col6}>
                      <Button
                        title="Yes"
                        type="outline"
                        raised
                        loading={this.props.orders.updatingOrder_other}
                        titleStyle={{color: variables.mainThemeColor}}
                        buttonStyle={mainStyles.outlineBtn}
                        onPress={this._proceedOrder.bind(null, 'prcd')}
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
                      {getOrderStatus(this.state.order.status).name}
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

              {this.state.order.deliveryAgent ? (
                <Card title="Delivery Agent Detail">
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      marginBottom: 20,
                    }}>
                    <View style={{flex: 1}}>
                      <Text style={styles.label}>Name:</Text>
                    </View>
                    <View style={{flex: 1, justifyContent: 'center'}}>
                      <Text style={{fontSize: 18}}>
                        {this.state.order.deliveryAgent.personalDetail
                          .firstName +
                          ' ' +
                          this.state.order.deliveryAgent.personalDetail
                            .lastName}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      marginBottom: 20,
                    }}>
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
                              this.state.order.deliveryAgent.personalDetail
                                .phone
                            }`,
                          );
                        }}>
                        {this.state.order.deliveryAgent.personalDetail.phone}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      marginBottom: 20,
                    }}>
                    <View style={{flex: 1}}>
                      <Text style={styles.label}>Vehicle Model:</Text>
                    </View>
                    <View style={{flex: 1, justifyContent: 'center'}}>
                      <Text style={{fontSize: 18}}>
                        {
                          this.state.order.deliveryAgent.vehicleDetail
                            .vehicleModel
                        }
                      </Text>
                    </View>
                  </View>
                </Card>
              ) : null}
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
