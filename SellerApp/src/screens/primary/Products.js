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
import {
  Header,
  Card,
  ListItem,
  Button,
  Text,
  Icon,
} from 'react-native-elements';

// * Import all store related stuffs
import * as ProductsActions from '../../store/actions/creators/ProductsActions';
import * as AuthActions from '../../store/actions/creators/AuthActions';

// * Import all screens/components

// * Import utilites

// * Import all styling stuffs
import variables from '../../styles/variables';
import mainStyles from '../../styles/mainStyle';

class ProductsScreen extends Component {
  componentDidMount() {
    this.props.getProductsFetch(this.props.auth.authToken);
  }

  render() {
    return (
      <View>
        <Header
          leftComponent={
            <Icon
              name="bars"
              type="font-awesome"
              size={20}
              color="#FFF"
              underlayColor="transparent"
              onPress={() => {
                this.props.navigation.toggleDrawer();
              }}
            />
          }
          centerComponent={{
            text: 'YOUR PRODUCTS',
            style: {color: '#fff'},
          }}
          rightComponent={
            <Icon
              name="product-hunt"
              type="font-awesome"
              color="#FFF"
              size={30}
            />
          }
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
          ) : !this.props.profile.profile.profileVerificationDetail ||
            !this.props.profile.profile.profileVerificationDetail.verified ||
            !this.props.profile.profile.storeDetail ||
            !this.props.profile.profile.storeDetail.verified ||
            !this.props.profile.profile.bankDetail ||
            !this.props.profile.profile.bankDetail.verified ? (
            <View>
              <Text style={{padding: 10, fontSize: 18}}>
                Your profile verification is still pending. You can enjoy the
                services, once your profile is verified by us.
              </Text>
              <Text style={{padding: 10, fontSize: 18}}>
                Thank you for your patience.
              </Text>
            </View>
          ) : this.props.products.products.length == 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
              }}>
              <Card containerStyle={{alignItems: 'center'}}>
                <Text style={{marginBottom: 20, fontSize: 20, color: 'green'}}>
                  No Product in your store.
                </Text>
                <Button
                  title="Add your first product now"
                  type="outline"
                  titleStyle={{color: variables.mainThemeColor}}
                  buttonStyle={mainStyles.outlineBtn}
                  onPress={() => {
                    this.props.navigation.navigate('add-new-product-stack');
                  }}
                />
              </Card>
            </View>
          ) : (
            <FlatList
              data={this.props.products.products}
              renderItem={({item, index}) => (
                <ListItem
                  key={index}
                  title={item.root.name}
                  subtitle={`${item.variants.length} Variants`}
                  chevron
                  onPress={() =>
                    this.props.navigation.navigate('product-detail-screen', {
                      productId: item._id,
                    })
                  }
                />
              )}
              keyExtractor={item => item._id.toString()}
            />
          )}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({});

const mapStateToProps = state => {
  return {
    profile: state.profile,
    auth: state.auth,
    products: state.products,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({...AuthActions, ...ProductsActions}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProductsScreen);
