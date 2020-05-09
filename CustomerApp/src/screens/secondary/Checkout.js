// * Import required modules/dependencies
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {ScrollView, StyleSheet, View, ToastAndroid} from 'react-native';
import {
  Header,
  Card,
  Text,
  Button,
  Icon,
  CheckBox,
} from 'react-native-elements';
import axios from 'axios';

// * Import all store related stuffs
import * as CartActions from '../../store/actions/creators/CartActions';

// * Import all screens/components

// * Import utilites
import {baseUrl} from '../../utils/constant';
import {storeDataInAsync, removeDataFromAsync} from '../../utils/helper';

// * Import all styling stuffs
import mainStyles from '../../styles/mainStyle';
import variables from '../../styles/variables';

class CheckoutScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      paymentType: 'cod',
    };
  }

  proceed = () => {
    if (this.state.paymentType === 'cod') {
      let data = {
        orderedFrom: this.props.cart.cart.storeId,
        items: this.props.cart.cart.products.map(product => ({
          productId: product.id,
          name: product.name,
          value: product.value,
          quantity: product.quantity,
          price: product.price,
        })),
        status: 'pen',
        paymentMode: 'cod',
        amount: {
          itemsPrice: this.props.cart.cart.products.reduce(
            (acc, cur) => acc + cur.quantity * cur.price,
            0,
          ),
          deliveryCharge: this.props.cart.cart.deliveryCharge,
        },
      };
      axios
        .post(baseUrl + '/order/place-order', data, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.props.auth.authToken}`,
          },
        })
        .then(res => {
          storeDataInAsync(
            'eSamagri_customer_cart',
            JSON.stringify(res.data.updatedCart),
          )
            .then(updatedCart => {
              dispatch(getCartDetailSuccess(JSON.parse(updatedCart)));
            })
            .catch(err => {});
          this.props.navigation.navigate('order-confirmation-screen');
        })
        .catch(err => {
          ToastAndroid.show(
            err.response
              ? err.response.status != 500
                ? err.response.data.errMessage
                : "This order can't be processed right now, please try again."
              : "This order can't be processed right now, please try again.",
            ToastAndroid.LONG,
          );
        });
    }
  };

  render() {
    if (this.props.cart.cart.products === 0) {
      console.log('object');
      this.props.navigation.navigate('home-screen');
    }
    return (
      <View style={{flex: 1}}>
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
            text: 'Checkout',
            style: {color: '#fff'},
          }}
          containerStyle={{
            backgroundColor: '#933dd4',
            justifyContent: 'space-around',
          }}
        />
        <ScrollView>
          {!this.props.cart.cart ||
          this.props.cart.cart.products.length === 0 ? (
            <Card title="Success" containerStyle={{alignItems: 'center'}}>
              <Text style={{marginBottom: 20, fontSize: 20, color: 'green'}}>
                You're already placed your order successfully. You'll be updated
                once it's processed.
              </Text>

              <Button
                title="Go to Home"
                type="outline"
                titleStyle={{color: variables.mainThemeColor}}
                buttonStyle={mainStyles.outlineBtn}
                onPress={() => {
                  this.props.navigation.navigate('home-screen');
                }}
              />
            </Card>
          ) : (
            <View>
              <Card title="You're almost there">
                <View>
                  <Text style={{fontSize: 20}}>
                    Your Final amount is
                    <Text style={{fontWeight: 'bold'}}>
                      {`  ₹ ${this.props.cart.cart.products.reduce(
                        (acc, cur) => acc + cur.quantity * cur.price,
                        0,
                      ) + this.props.cart.cart.deliveryCharge}`}
                    </Text>
                  </Text>
                </View>
                <View style={{marginTop: 15}}>
                  <Text style={mainStyles.formLabel}>
                    Choose your payment method:
                  </Text>
                  <View style={{alignItems: 'flex-start'}}>
                    <View>
                      <CheckBox
                        containerStyle={{
                          backgroundColor: 'transparent',
                          borderColor: 'transparent',
                        }}
                        center
                        title="Cash on Delivery"
                        checkedIcon="dot-circle-o"
                        uncheckedIcon="circle-o"
                        checkedColor={variables.mainThemeColor}
                        checked={this.state.paymentType === 'cod'}
                        onPress={() => {
                          this.setState({
                            paymentType: 'cod',
                          });
                        }}
                      />
                    </View>
                    {/* <View>
                      <CheckBox
                        containerStyle={{
                          backgroundColor: 'transparent',
                          borderColor: 'transparent',
                        }}
                        center
                        title="Online"
                        checkedIcon="dot-circle-o"
                        uncheckedIcon="circle-o"
                        checkedColor={variables.mainThemeColor}
                        checked={this.state.paymentType === 'online'}
                        onPress={() => {
                          this.setState({
                            paymentType: 'online',
                          });
                        }}
                      />
                    </View> */}
                  </View>
                </View>
                <View style={{alignItems: 'center', marginTop: 15}}>
                  <Button
                    title="Proceed"
                    buttonStyle={{
                      width: 150,
                      borderRadius: 20,
                      backgroundColor: variables.mainThemeColor,
                    }}
                    onPress={this.proceed.bind(null)}
                  />
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
  btn: {
    width: '120%',
    height: 20,
    borderRadius: 20,
    padding: 10,
    justifyContent: 'center',
  },
});

const mapStateToProps = ({auth, cart, orders}) => {
  return {
    auth,
    cart,
    orders,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({...CartActions}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CheckoutScreen);
