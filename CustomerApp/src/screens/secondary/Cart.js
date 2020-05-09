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
import {Header, Card, Text, Button, Image, Icon} from 'react-native-elements';

// * Import all store related stuffs
import * as CartActions from '../../store/actions/creators/CartActions';

// * Import all screens/components

// * Import utilites

// * Import all styling stuffs
import mainStyles from '../../styles/mainStyle';
import variables from '../../styles/variables';

class CartScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.updateCartToServerFetch(this.props.auth.authToken);
  }

  _changeProductQuantityinCart = (type, variant) => {
    let tempCart = {
      storeId: this.props.cart.cart.storeId,
      products: [...this.props.cart.cart.products],
      deliveryCharge: this.props.cart.cart.deliveryCharge,
    };
    let productIndexInCartProducts = null;
    tempCart.products.forEach((product, index) => {
      if (
        product.id === variant.productId &&
        product.variantId === variant.variantId
      ) {
        productIndexInCartProducts = index;
        return;
      }
    });
    if (type === 'increment') {
      tempCart.products[productIndexInCartProducts].quantity++;
      if (tempCart.products[productIndexInCartProducts].quantity > 5) {
        Alert.alert(
          'Product quantity exceeding the limit',
          'You cannot add more than 5 same products for now!',
          [
            {
              text: 'OK',
              onPress: () => {
                tempCart.products[productIndexInCartProducts].quantity--;
                return;
              },
            },
          ],
        );
        return;
      } else {
        this.props.updateCartToAsyncStorageFetch('increment', tempCart);
      }
    } else if (type === 'decrement') {
      tempCart.products[productIndexInCartProducts].quantity--;
      if (tempCart.products[productIndexInCartProducts].quantity === 0) {
        tempCart.products.splice(productIndexInCartProducts, 1);
        this.props.updateCartToAsyncStorageFetch('decrement', tempCart);
      } else {
        this.props.updateCartToAsyncStorageFetch(
          this.props.auth.authToken,
          'decrement',
          tempCart,
        );
      }
    } else return;
  };

  _checkout = () => {
    let itemTotalPrice = this.props.cart.cart.products.reduce(
      (acc, cur) => acc + cur.quantity * cur.price,
      0,
    );
    if (itemTotalPrice < 200) {
      Alert.alert(
        'Minimum order alert',
        'Value of cart should be more than ₹ 200, excluding delivery charge',
        [
          {
            text: 'Cancel',
            onPress: () => {
              return;
            },
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => {
              return;
            },
          },
        ],
        {cancelable: false},
      );
      return;
    } else {
      this.props.navigation.navigate('checkout-screen');
    }
  };

  render() {
    const ItemCard = props => {
      return (
        <Card>
          <View style={mainStyles.row}>
            <View style={mainStyles.col5}>
              <Image
                source={{uri: 'https://via.placeholder.com/100'}}
                style={{width: 100, height: 100}}
                PlaceholderContent={<ActivityIndicator />}
              />
            </View>
            <View style={mainStyles.col7}>
              <View style={mainStyles.row}>
                <View style={mainStyles.col9}>
                  <Text>{props.product.name}</Text>
                  <Text style={{marginTop: 15}}>{`₹ ${props.product.price} / ${
                    props.product.value
                  }`}</Text>
                </View>
                <View style={[mainStyles.col3, {justifyContent: 'center'}]}>
                  <Text style={{textAlign: 'center'}}>{`₹ ${props.product
                    .price * props.product.quantity}`}</Text>
                </View>
              </View>

              <View style={[mainStyles.row, {marginTop: 15}]}>
                <View style={mainStyles.col4}>
                  <Button
                    type="outline"
                    buttonStyle={styles.btn}
                    title="-"
                    titleStyle={{color: variables.mainThemeColor}}
                    onPress={this._changeProductQuantityinCart.bind(
                      null,
                      'decrement',
                      {
                        productId: props.product.id,
                        variantId: props.product.variantId,
                      },
                    )}
                  />
                </View>
                <View
                  style={[
                    mainStyles.col4,
                    {
                      justifyContent: 'center',
                      alignItems: 'center',
                    },
                  ]}>
                  <Text>{props.product.quantity}</Text>
                </View>
                <View style={mainStyles.col4}>
                  <Button
                    type="outline"
                    buttonStyle={styles.btn}
                    title="+"
                    titleStyle={{color: variables.mainThemeColor}}
                    onPress={this._changeProductQuantityinCart.bind(
                      null,
                      'increment',
                      {
                        productId: props.product.id,
                        variantId: props.product.variantId,
                      },
                    )}
                  />
                </View>
              </View>
            </View>
          </View>
        </Card>
      );
    };

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
            text: 'Your Cart',
            style: {color: '#fff'},
          }}
          containerStyle={{
            backgroundColor: '#933dd4',
            justifyContent: 'space-around',
          }}
        />
        {this.props.cart.updatingCart ? (
          <ActivityIndicator size="large" />
        ) : !this.props.cart.cart ||
          this.props.cart.cart.products.length === 0 ? (
          <View
            style={{
              flex: 1,
              height: '100%',
              backgroundColor: '#fff',
              justifyContent: 'center',
            }}>
            <View style={{alignItems: 'center'}}>
              <Text style={{fontSize: 18, textAlign: 'center'}}>
                Cart is empty, add your desired items to continue...
              </Text>
            </View>
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              height: '100%',
            }}>
            <View style={{flex: 2}}>
              <ScrollView>
                <View style={mainStyles.row}>
                  {this.props.cart.cart.products.map((product, i) => (
                    <ItemCard key={i} product={product} />
                  ))}
                </View>
              </ScrollView>
            </View>
            <View
              style={{
                flex: 1,
                marginTop: 20,
                paddingBottom: 20,
                backgroundColor: '#fff',
                padding: 10,
              }}>
              <View style={[mainStyles.row, {marginTop: 20}]}>
                <View style={mainStyles.col6}>
                  <Text>Items Total Price:</Text>
                </View>
                <View style={mainStyles.col6}>
                  <Text style={{textAlign: 'right'}}>
                    ₹
                    {this.props.cart.cart.products.reduce(
                      (acc, cur) => acc + cur.quantity * cur.price,
                      0,
                    )}
                  </Text>
                </View>
              </View>
              <View style={[mainStyles.row, {marginTop: 20}]}>
                <View style={mainStyles.col6}>
                  <Text>Delivery Charge:</Text>
                </View>
                <View style={mainStyles.col6}>
                  <Text style={{textAlign: 'right'}}>
                    ₹ {this.props.cart.cart.deliveryCharge}
                  </Text>
                </View>
              </View>
              <View style={[mainStyles.row, {marginTop: 20}]}>
                <View style={mainStyles.col6}>
                  <Text>Final Amount:</Text>
                </View>
                <View style={mainStyles.col6}>
                  <Text style={{textAlign: 'right'}}>
                    ₹
                    {this.props.cart.cart.products.reduce(
                      (acc, cur) => acc + cur.quantity * cur.price,
                      0,
                    ) + this.props.cart.cart.deliveryCharge}
                  </Text>
                </View>
              </View>

              <View style={{flex: 1, alignItems: 'center', margin: 10}}>
                <Button
                  title="Checkout"
                  buttonStyle={{
                    width: 150,
                    borderRadius: 20,
                    backgroundColor: variables.mainThemeColor,
                  }}
                  onPress={this._checkout.bind(null)}
                />
              </View>
            </View>
          </View>
        )}
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
    borderColor: variables.mainThemeColor,
    height: 20,
    borderRadius: 20,
    padding: 10,
    justifyContent: 'center',
  },
});

const mapStateToProps = ({auth, store, cart}) => {
  return {
    auth,
    store,
    cart: {
      ...cart,
      cart: {
        storeId: cart.cart.storeId,
        products: [...cart.cart.products],
        deliveryCharge: cart.cart.deliveryCharge,
      },
    },
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({...CartActions}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CartScreen);
