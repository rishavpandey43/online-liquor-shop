// * Import required modules/dependencies
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {
  ScrollView,
  StyleSheet,
  View,
  Alert,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import {
  Header,
  Card,
  Button,
  Text,
  Input,
  CheckBox,
  Icon,
} from 'react-native-elements';
import RNPickerSelect from 'react-native-picker-select';

import axios from 'axios';

// * Import all store related stuffs

// * Import all screens/components

// * Import utilites

// * Import all styling stuffs
import mainStyles from '../../styles/mainStyle';
import variables from '../../styles/variables';

import * as ProfileActions from '../../store/actions/creators/ProfileActions';
import * as ProductsActions from '../../store/actions/creators/ProductsActions';

import * as helper from '../../utils/helper';
import {baseUrl, categoryList} from '../../utils/constant';

class AddNewProductScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: {
        name: '',
        type: 'packet',
        brand: '',
        variants: [
          {
            value: '',
            price: '',
            stock: '',
          },
        ],
      },
      loading: false,
    };
  }

  addProduct = () => {
    let tempData = this.state.product;
    let isEmpty = false;
    for (const item in tempData) {
      if (typeof tempData[item] === 'string') {
        if (tempData[item] == '') {
          isEmpty = true;
        }
      } else if (typeof tempData[item] === 'object') {
        tempData[item].forEach(element => {
          if (element.value === '' || element.price === '') {
            isEmpty = true;
          }
        });
      }
    }
    if (isEmpty) {
      Alert.alert('Input Invalid', 'Please fill all the details to continue.');
      return;
    } else {
      let data = {
        general: {
          name: tempData.name.toLowerCase(),
          category: tempData.category.toLowerCase(),
          type: tempData.type.toLowerCase(),
          brand: tempData.brand.toLowerCase(),
        },
        sellerSpecific: {
          variants: tempData.variants.map(item => ({
            value: item.value.toLowerCase(),
            price: item.price.toLowerCase(),
            stock: item.stock.toLowerCase(),
          })),
        },
      };
      this.setState({loading: true});
      axios
        .post(baseUrl + '/seller/add-new-product', data, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.props.auth.authToken}`,
          },
        })
        .then(res => {
          this.setState({
            product: {
              name: '',
              category: '',
              type: 'packet',
              brand: '',
              variants: [
                {
                  value: '',
                  price: '',
                  stock: '',
                },
              ],
            },
            loading: false,
          });
          this.props.getProductsFetch(this.props.auth.authToken);
          ToastAndroid.show(
            res.data.successMessage || 'Product has been added successfull',
            ToastAndroid.LONG,
          );
        })
        .catch(err => {
          this.setState({loading: false});
          ToastAndroid.show(
            err.response
              ? err.response.status != 500
                ? err.response.data.errMessage
                : "Product can't be added, please try again."
              : "Product can't be added, please try again.",
            ToastAndroid.LONG,
          );
        });
    }
  };

  render() {
    return (
      <View>
        <Header
          leftComponent={
            <Icon
              name="arrow-left"
              type="font-awesome"
              size={20}
              color="#FFF"
              type="font-awesome"
              underlayColor="transparent"
              onPress={() => {
                this.props.navigation.goBack();
              }}
            />
          }
          centerComponent={{
            text: 'ADD NEW PRODUCT',
            style: {color: '#fff'},
          }}
          containerStyle={{
            backgroundColor: '#933dd4',
            justifyContent: 'space-around',
          }}
        />
        <ScrollView>
          {this.props.profile.fetchingProfile ? (
            <View
              style={{
                marginTop: 50,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ActivityIndicator size="large" />
            </View>
          ) : this.props.profile.errMessage || !this.props.profile.profile ? (
            <Card title="Error Message" containerStyle={{alignItems: 'center'}}>
              <Text style={{marginBottom: 20, fontSize: 20, color: 'red'}}>
                {this.props.profile.errMessage || 'Internal Server Error'}
              </Text>
              <Button
                title="Retry"
                type="outline"
                titleStyle={{color: variables.mainThemeColor}}
                buttonStyle={mainStyles.outlineBtn}
                onPress={() => {
                  this.props.getProfileFetch(this.props.auth.authToken);
                }}
              />
            </Card>
          ) : !this.props.profile.profile.profileVerificationDetail ||
            this.props.profile.profile.profileVerificationDetail
              .verification !== 'ver' ||
            !this.props.profile.profile.storeDetail ||
            this.props.profile.profile.storeDetail.verification !== 'ver' ||
            !this.props.profile.profile.bankDetail ||
            this.props.profile.profile.bankDetail.verification !== 'ver' ? (
            <View>
              <Text style={{padding: 10, fontSize: 18}}>
                Your profile verification is still not done. You can enjoy the
                services, once your profile is verified by us.
              </Text>
              <Text style={{padding: 10, fontSize: 18}}>
                Thank you for your patience.
              </Text>
            </View>
          ) : (
            <View style={[mainStyles.container, {marginBottom: 100}]}>
              <View style={mainStyles.formGroup}>
                <Input
                  label="Product Name:"
                  placeholder="Kingfisher Draught Beer"
                  value={this.state.product.name}
                  onChangeText={name => {
                    this.setState({
                      product: {
                        ...this.state.product,
                        name,
                      },
                    });
                  }}
                />
              </View>

              {/* <View style={mainStyles.formGroup}>
                <Input
                  label="Product Description:"
                  multiline
                  maxLength={200}
                  placeholder="Description can't be in more than 200 characters."
                  value={this.state.product.desc}
                  onChangeText={desc => {
                    this.setState({
                      product: {
                        ...this.state.product,
                        desc,
                      },
                    });
                  }}
                />
              </View> */}

              <View style={mainStyles.formGroup}>
                <Text style={mainStyles.formLabel}>Category:</Text>
                <View>
                  <RNPickerSelect
                    value={this.state.product.category}
                    onValueChange={(itemValue, itemIndex) => {
                      this.setState({
                        product: {
                          ...this.state.product,
                          category: itemValue,
                        },
                      });
                    }}
                    items={categoryList}
                    placeholder={{}}
                  />
                </View>
              </View>

              <View style={mainStyles.formGroup}>
                <Input
                  label="Brand:"
                  placeholder="McDowells, Kingfisher, Chivas Regal"
                  value={this.state.product.brand}
                  onChangeText={brand => {
                    this.setState({
                      product: {
                        ...this.state.product,
                        brand,
                      },
                    });
                  }}
                />
              </View>

              <View style={mainStyles.formGroup}>
                <View style={[mainStyles.row, {marginLeft: 5}]}>
                  <View style={mainStyles.col6}>
                    <Text style={mainStyles.formLabel}>Variants:</Text>
                  </View>
                  <View style={[mainStyles.col6, {alignItems: 'center'}]}>
                    <Icon
                      name="plus"
                      size={25}
                      type="font-awesome"
                      color={variables.mainThemeColor}
                      onPress={() => {
                        let variants = this.state.product.variants;
                        variants.push({
                          value: '',
                          price: '',
                        });
                        this.setState({
                          product: {
                            ...this.state.product,
                            variants,
                          },
                        });
                      }}
                    />
                  </View>
                </View>

                <View style={{marginBottom: 20}}>
                  {this.state.product.variants.map((item, index) => (
                    <View key={index}>
                      <View
                        style={[
                          mainStyles.row,
                          {marginTop: 10, marginRight: 5},
                        ]}>
                        <View style={mainStyles.col11}>
                          <View style={mainStyles.row}>
                            <View style={mainStyles.col7}>
                              <Input
                                label="Value"
                                placeholder="100 ml or 1 l"
                                value={this.state.product.variants[index].value}
                                onChangeText={value => {
                                  let variants = [
                                    ...this.state.product.variants,
                                  ];
                                  variants[index].value = value;
                                  this.setState({
                                    product: {
                                      ...this.state.product,
                                      variants,
                                    },
                                  });
                                }}
                              />
                            </View>
                            <View style={mainStyles.col5}>
                              <Input
                                label="Price"
                                keyboardType="numeric"
                                placeholder="45"
                                value={this.state.product.variants[index].price}
                                onChangeText={price => {
                                  let variants = [
                                    ...this.state.product.variants,
                                  ];
                                  variants[index].price = price;
                                  this.setState({
                                    product: {
                                      ...this.state.product,
                                      variants,
                                    },
                                  });
                                }}
                              />
                            </View>
                            <View style={mainStyles.col6}>
                              <Input
                                label="Stock"
                                keyboardType="numeric"
                                placeholder="20"
                                value={this.state.product.variants[index].stock}
                                onChangeText={stock => {
                                  let variants = [
                                    ...this.state.product.variants,
                                  ];
                                  variants[index].stock = stock;
                                  this.setState({
                                    product: {
                                      ...this.state.product,
                                      variants,
                                    },
                                  });
                                }}
                              />
                            </View>
                          </View>
                        </View>
                        <View
                          style={[mainStyles.col1, {justifyContent: 'center'}]}>
                          <Icon
                            name="times"
                            size={25}
                            color="red"
                            type="font-awesome"
                            containerStyle={{
                              display: `${
                                this.state.product.variants.length > 1
                                  ? 'flex'
                                  : 'none'
                              }`,
                            }}
                            onPress={() => {
                              let variants = this.state.product.variants;
                              variants.splice(index, 1);
                              this.setState({
                                product: {
                                  ...this.state.product,
                                  variants,
                                },
                              });
                            }}
                          />
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              <View style={[mainStyles.row, {marginBottom: 20}]}>
                <View style={mainStyles.col6}>
                  <Button
                    title="Cancel"
                    type="outline"
                    raised
                    titleStyle={{color: variables.mainThemeColor}}
                    buttonStyle={mainStyles.outlineBtn}
                    onPress={() => {
                      this.setState({
                        bankDetailCardDisplay: false,
                        bankDetail: {
                          name: '',
                          accountNumber: '',
                          ifscCode: '',
                          branchName: '',
                        },
                      });
                    }}
                  />
                </View>
                <View style={mainStyles.col6}>
                  <Button
                    title="Submit"
                    type="outline"
                    raised
                    titleStyle={{color: variables.mainThemeColor}}
                    buttonStyle={mainStyles.outlineBtn}
                    onPress={this.addProduct.bind(null)}
                    loading={this.state.loading}
                  />
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({});

const mapStateToProps = state => {
  return {
    auth: state.auth,
    profile: state.profile,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({...ProfileActions, ...ProductsActions}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddNewProductScreen);
