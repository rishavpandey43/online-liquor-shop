// * Import required modules/dependencies
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {
  ScrollView,
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  VirtualizedList,
} from 'react-native';
import {
  Header,
  Card,
  Text,
  Button,
  Image,
  Icon,
  SearchBar,
  Badge,
} from 'react-native-elements';
import RNPickerSelect from 'react-native-picker-select';

// * Import all store related stuffs
import * as HomeActions from '../../store/actions/creators/HomeActions';
import * as CartActions from '../../store/actions/creators/CartActions';

// * Import all screens/components

// * Import utilites
import {obtainAddressInString, getStoreCategory} from '../../utils/helper';

// * Import all styling stuffs
import mainStyles from '../../styles/mainStyle';
import variables from '../../styles/variables';

class StoreDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCategory: {name: 'All', value: 'all'},
      filteredProduct: this.props.store.store
        ? this.props.store.store.products
        : [],
      productVariantForPicker: this.props.store.store
        ? this.props.store.store.products.map(product => ({
            productId: product._id,
            variantId: product.variants[0]._id,
            value: product.variants[0].value,
          }))
        : [],
      search: '',
    };
  }

  _filterByCategory = category => {
    if (category.value === 'all') {
      this.setState({
        selectedCategory: category,
        filteredProduct: this.props.store.store.products,
      });
    } else
      this.setState({
        selectedCategory: category,
        filteredProduct: this.props.store.store.products.filter(
          product => product.root.category === category.value,
        ),
      });
  };

  _searchProduct = search => {
    this.setState({
      selectedCategory: {name: 'All', value: 'all'},
      filteredProduct: this.props.store.store.products.filter(
        product =>
          product.root.name.toLowerCase().indexOf(search.toLowerCase()) !== -1,
      ),
    });
  };

  _addToCart = productId => {
    let cart = {
      storeId: this.props.store.store._id,
      products: [
        {
          id: productId,
          variantId: this.state.productVariantForPicker.filter(
            product => product.productId === productId,
          )[0].variantId,
          quantity: 1,
          updating: false,
        },
      ],
    };
    // * Check if the cart is empty to add first product
    if (!this.props.cart.cart.storeId) {
      this.props.updateCartToAsyncStorageFetch('new', cart);
    }
    // * Confirm to user, if he tries to add product from another store to cart
    else if (this.props.cart.cart.storeId !== this.props.store.store._id) {
      Alert.alert(
        'Store change',
        "You're about to change the store. You can't select products from multiple store in single order.",
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
            onPress: () =>
              this.props.updateCartToAsyncStorageFetch('new', cart),
          },
        ],
      );
    }
    // * Here, when user add product from same store to cart
    else if (this.props.cart.cart.storeId === this.props.store.store._id) {
      let tempCart = {
        storeId: this.props.cart.cart.storeId,
        products: [...this.props.cart.cart.products],
        deliveryCharge: this.props.cart.cart.deliveryCharge,
      };
      tempCart.products.push(cart.products[0]);
      this.props.updateCartToAsyncStorageFetch('new', tempCart);
      return;
    }
  };

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
        this.props.updateCartToAsyncStorageFetch('decrement', tempCart);
      }
    } else return;
  };

  render() {
    const Product = ({product}) => (
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          marginTop: 10,
          marginBottom: 10,
        }}>
        <View
          style={{
            flex: 2,
            justifyContent: 'center',
            marginTop: 10,
            marginRight: 25,
          }}>
          <View>
            <Text style={{fontSize: 20}}>{product.root.name}</Text>
          </View>
          <RNPickerSelect
            value={
              this.state.productVariantForPicker.filter(
                variant => variant.productId === product._id,
              )[0].value
            }
            onValueChange={(itemValue, itemIndex) => {
              let tempProductVariantForPicker = [
                ...this.state.productVariantForPicker,
              ];
              let productIndex = null;
              this.state.productVariantForPicker.forEach((variant, i) => {
                if (product._id === variant.productId) {
                  productIndex = i;
                }
              });
              tempProductVariantForPicker[productIndex].value = itemValue;
              tempProductVariantForPicker[productIndex].variantId =
                product.variants[itemIndex]._id;
              this.setState({
                productVariantForPicker: [...tempProductVariantForPicker],
              });
            }}
            items={product.variants.map((variant, index) => ({
              ...variant,
              label: `${variant.value}/₹ ${variant.price}`,
              value: variant.value,
            }))}
            placeholder={{}}
          />
          {/* <Picker
            selectedValue={
              this.state.productVariantForPicker.filter(
                variant => variant.productId === product._id,
              )[0].value
            }
            style={{height: 40, width: 'auto', marginTop: 10}}
            onValueChange={(itemValue, itemIndex) => {
              // * AWESOME LOGIC TO CHANGE THE VARIANT PICKER ;)
              let productIndex = null;
              this.state.productVariantForPicker.forEach((variant, i) => {
                if (product._id === variant.productId) {
                  productIndex = i;
                }
              });
              let tempProductVariantForPicker = this.state
                .productVariantForPicker;
              tempProductVariantForPicker[productIndex].value = itemValue;
              tempProductVariantForPicker[productIndex].variantId =
                product.variants[itemIndex]._id;
              this.setState({
                productVariantForPicker: tempProductVariantForPicker,
              });
            }}>
            {product.variants.map((variant, index) => (
              <Picker.Item
                key={index}
                label={`${variant.value}/₹ ${variant.price}`}
                value={variant.value}
              />
            ))}
          </Picker> */}
        </View>
        <View style={{flex: 1, justifyContent: 'center', marginLeft: 5}}>
          {this.props.cart.cart ? (
            // * AWESOME LOGIC OF DISPLAYING BUTTONS BASED ON VARIANTS ADDED IN CART
            !this.props.cart.cart.products.filter(
              cartProduct =>
                cartProduct.variantId ===
                this.state.productVariantForPicker.filter(
                  variant => variant.productId === product._id,
                )[0].variantId,
            )[0] ? (
              <View style={{justifyContent: 'center'}}>
                <Button
                  title="Add to cart"
                  titleStyle={{color: variables.mainThemeColor}}
                  type="outline"
                  buttonStyle={[styles.btn, mainStyles.outlineBtn]}
                  onPress={this._addToCart.bind(null, product._id)}
                />
              </View>
            ) : (
              <View style={{flexDirection: 'row'}}>
                <View style={{flex: 1, justifyContent: 'center'}}>
                  <Button
                    title="-"
                    titleStyle={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      color: variables.mainThemeColor,
                    }}
                    type="outline"
                    buttonStyle={[
                      styles.btn,
                      mainStyles.outlineBtn,
                      {padding: 2, width: '100%', minHeight: 35},
                    ]}
                    onPress={this._changeProductQuantityinCart.bind(
                      null,
                      'decrement',
                      this.state.productVariantForPicker.filter(
                        variant => variant.productId === product._id,
                      )[0],
                    )}
                  />
                </View>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={{fontSize: 18}}>
                    {
                      this.props.cart.cart.products.filter(
                        cartProduct =>
                          cartProduct.variantId ===
                          this.state.productVariantForPicker.filter(
                            variant => variant.productId === product._id,
                          )[0].variantId,
                      )[0].quantity
                    }
                  </Text>
                </View>
                <View style={{flex: 1}}>
                  <Button
                    title="+"
                    titleStyle={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      color: variables.mainThemeColor,
                    }}
                    type="outline"
                    buttonStyle={[
                      styles.btn,
                      mainStyles.outlineBtn,
                      {padding: 2, width: '100%', minHeight: 35},
                    ]}
                    onPress={this._changeProductQuantityinCart.bind(
                      null,
                      'increment',
                      this.state.productVariantForPicker.filter(
                        variant => variant.productId === product._id,
                      )[0],
                    )}
                  />
                </View>
              </View>
            )
          ) : (
            // * Display this at initial, if cart is empty
            <View style={{alignItems: 'center'}}>
              <Button
                type="outline"
                buttonStyle={styles.btn}
                title="Add to cart"
                onPress={this._addToCart.bind(null, product._id)}
                titleStyle={{color: variables.mainThemeColor}}
              />
            </View>
          )}
        </View>
      </View>
    );

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
              underlayColor="transparent"
            />
          }
          centerComponent={{
            text: this.props.store.store
              ? this.props.store.store.storeDetail.name
              : '',
            style: {color: '#fff'},
          }}
          rightComponent={
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('cart-screen');
                }}
                style={mainStyles.row}>
                <Icon
                  type="font-awesome"
                  name="shopping-basket"
                  color="#FFF"
                  size={25}
                />
                <Badge
                  value={
                    this.props.cart.cart
                      ? this.props.cart.cart.products.reduce(
                          (acc, cur) => acc + cur.quantity,
                          0,
                        )
                      : 0
                  }
                  badgeStyle={{backgroundColor: variables.mainThemeColor}}
                  containerStyle={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                  }}
                />
              </TouchableOpacity>
            </View>
          }
          containerStyle={{
            backgroundColor: '#933dd4',
            justifyContent: 'space-around',
          }}
        />
        <ScrollView>
          {!this.props.store.store ? (
            <Card title="Error Message" containerStyle={{alignItems: 'center'}}>
              <Text style={{marginBottom: 20, fontSize: 20, color: 'red'}}>
                Some error occured, retry
              </Text>
              <Button
                title="Go back"
                type="outline"
                titleStyle={{color: variables.mainThemeColor}}
                buttonStyle={mainStyles.outlineBtn}
                onPress={() => {
                  this.props.navigation.goBack();
                }}
              />
            </Card>
          ) : (
            <View
              style={[mainStyles.container, {padding: 10, marginBottom: 100}]}>
              <View style={[mainStyles.row, {marginTop: 10}]}>
                <View style={mainStyles.col4}>
                  <Image
                    source={{uri: 'https://via.placeholder.com/100'}}
                    style={{width: 100, height: 100}}
                    PlaceholderContent={<ActivityIndicator />}
                  />
                </View>
                <View style={mainStyles.col8}>
                  <Text style={{fontSize: 20}}>
                    {obtainAddressInString(
                      this.props.store.store.storeDetail.address,
                    )}
                  </Text>
                  {/* <View style={[mainStyles.row, {marginTop: 10}]}>
                    <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                      Status:
                    </Text>
                    <Text
                      style={{
                        fontSize: 18,
                        color: 'green',
                        paddingLeft: 10,
                      }}>
                      Open
                    </Text>
                  </View> */}
                </View>
              </View>

              <View
                style={{
                  marginTop: 10,
                  borderBottomColor: '#aaa',
                  borderBottomWidth: 1,
                  paddingBottom: 20,
                }}>
                <Text style={{fontSize: 18}}>Sort by categories</Text>
                <View style={mainStyles.row}>
                  {getStoreCategory(this.props.store.store.products).map(
                    (category, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          this._filterByCategory(category);
                        }}>
                        <Text
                          style={[
                            styles.categoryTag,
                            this.state.selectedCategory.value === category.value
                              ? styles.selected
                              : '',
                          ]}>
                          {category.name}
                        </Text>
                      </TouchableOpacity>
                    ),
                  )}
                </View>
              </View>
              <View
                style={{
                  marginTop: 10,
                  borderBottomColor: '#aaa',
                  borderBottomWidth: 1,
                  paddingBottom: 20,
                }}>
                <SearchBar
                  placeholder="Search in Seller 1 Store..."
                  onChangeText={search => {
                    this.setState({
                      search,
                    });
                    this._searchProduct(search);
                  }}
                  value={this.state.search}
                  lightTheme
                  round
                  showLoading={false}
                  containerStyle={{backgroundColor: 'transparent'}}
                  inputContainerStyle={{backgroundColor: 'transparent'}}
                />
              </View>
              <View style={{marginTop: 10}}>
                <View>
                  <View>
                    <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                      {this.state.selectedCategory.name}:
                    </Text>
                  </View>
                  {this.state.filteredProduct.length === 0 ? (
                    <Text
                      style={{
                        fontSize: 20,
                        marginTop: 15,
                        textAlign: 'center',
                        color: 'red',
                      }}>
                      No Product found
                    </Text>
                  ) : (
                    <SafeAreaView style={{flex: 1}}>
                      <VirtualizedList
                        data={this.state.filteredProduct}
                        renderItem={({item, index}) => (
                          <Product key={index} product={item} />
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        getItemCount={data => {
                          return data.length;
                        }}
                        getItem={(data, index) => {
                          return data[index];
                        }}
                      />
                    </SafeAreaView>
                  )}
                </View>
              </View>
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
  categoryTag: {
    fontSize: 18,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: variables.mainThemeColor,
    color: variables.mainThemeColor,
    margin: 5,
    minWidth: 50,
    textAlign: 'center',
  },
  selected: {
    backgroundColor: variables.mainThemeColor,
    color: '#fff',
  },
  btn: {
    borderRadius: 5,
    borderColor: variables.mainThemeColor,
  },
});

const mapStateToProps = ({auth, sellers, store, cart}) => {
  return {
    auth,
    sellers,
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
  return bindActionCreators({...HomeActions, ...CartActions}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StoreDetailScreen);
