// * Import required modules/dependencies
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {
  ScrollView,
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {Header, Card, Button, Text, Icon} from 'react-native-elements';

// * Import all store related stuffs
import * as ProductsActions from '../../store/actions/creators/ProductsActions';

// * Import all screens/components

// * Import utilites
import {getCategoryName} from '../../utils/helper';

// * Import all styling stuffs
import variables from '../../styles/variables';
import mainStyles from '../../styles/mainStyle';

class ProductDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: null,
    };
  }

  componentDidMount() {
    if (this.props.route.params.productId) {
      console.log(this.props.route.params.productId);
      this.setState({
        product: this.props.products.products.filter(
          product => product._id === this.props.route.params.productId,
        )[0],
      });
    }
  }

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
              underlayColor="transparent"
              onPress={() => {
                this.props.navigation.goBack();
              }}
            />
          }
          centerComponent={{
            text: 'Your Product',
            style: {color: '#fff'},
          }}
          containerStyle={{
            backgroundColor: '#933dd4',
            justifyContent: 'space-around',
          }}
        />
        <ScrollView>
          {this.props.products.fetchingProduct ? (
            <View
              style={{
                marginTop: 50,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ActivityIndicator size="large" />
            </View>
          ) : this.props.products.errMessage ? (
            <Card title="Error Message" containerStyle={{alignItems: 'center'}}>
              <Text style={{marginBottom: 20, fontSize: 20, color: 'red'}}>
                {this.props.products.errMessage || 'Internal Server Error'}
              </Text>
              <Button
                title="Retry"
                type="outline"
                titleStyle={{color: variables.mainThemeColor}}
                buttonStyle={mainStyles.outlineBtn}
                onPress={() => {
                  this.props.getProductsFetch();
                }}
              />
            </Card>
          ) : !this.state.product ? (
            <Text>
              No product selected, please select valid product to see the detail
            </Text>
          ) : (
            <View style={[mainStyles.container, {marginBottom: 100}]}>
              <Card title="Product Detail">
                <View style={mainStyles.infoGroup}>
                  <View style={mainStyles.labelGroup}>
                    <Text style={mainStyles.labelText}>Name:</Text>
                  </View>
                  <View>
                    <Text style={mainStyles.value}>
                      {this.state.product.root.name}
                    </Text>
                  </View>
                </View>

                <View style={mainStyles.infoGroup}>
                  <View style={mainStyles.labelGroup}>
                    <Text style={mainStyles.labelText}>Brand:</Text>
                  </View>
                  <View>
                    <Text style={mainStyles.value}>
                      {this.state.product.root.brand}
                    </Text>
                  </View>
                </View>

                <View style={mainStyles.infoGroup}>
                  <View style={mainStyles.labelGroup}>
                    <Text style={mainStyles.labelText}>Category:</Text>
                  </View>
                  <View>
                    <Text style={mainStyles.value}>
                      {getCategoryName(this.state.product.root.category)}
                    </Text>
                  </View>
                </View>

                <View style={mainStyles.infoGroup}>
                  <View style={mainStyles.labelGroup}>
                    <Text style={mainStyles.labelText}>Type:</Text>
                  </View>
                  <View>
                    <Text style={mainStyles.value}>
                      {this.state.product.root.type}
                    </Text>
                  </View>
                </View>

                <View style={mainStyles.infoGroup}>
                  <View style={mainStyles.labelGroup}>
                    <Text style={mainStyles.labelText}>Variants:</Text>
                  </View>
                  <FlatList
                    data={this.state.product.variants}
                    renderItem={({item, index}) => {
                      return (
                        <View key={item._id} style={mainStyles.row}>
                          <View style={mainStyles.col4}>
                            <View style={mainStyles.infoGroup}>
                              <View style={mainStyles.labelGroup}>
                                <Text style={mainStyles.labelText}>
                                  Quantity:
                                </Text>
                              </View>
                              <View>
                                <Text style={mainStyles.value}>
                                  {item.value}
                                </Text>
                              </View>
                            </View>
                          </View>
                          <View style={mainStyles.col4}>
                            <View style={mainStyles.infoGroup}>
                              <View style={mainStyles.labelGroup}>
                                <Text style={mainStyles.labelText}>Price:</Text>
                              </View>
                              <View>
                                <Text style={mainStyles.value}>
                                  ₹ {item.price}
                                </Text>
                              </View>
                            </View>
                          </View>
                          <View style={mainStyles.col4}>
                            <View style={mainStyles.infoGroup}>
                              <View style={mainStyles.labelGroup}>
                                <Text style={mainStyles.labelText}>Stock:</Text>
                              </View>
                              <View>
                                <Text style={mainStyles.value}>
                                  {item.stock}
                                </Text>
                              </View>
                            </View>
                          </View>
                        </View>
                      );
                    }}
                    keyExtractor={(item, index) => {
                      return item._id.toString();
                    }}
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

const styles = StyleSheet.create({});

const mapStateToProps = state => {
  return {
    products: state.products,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(ProductsActions, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProductDetailScreen);
