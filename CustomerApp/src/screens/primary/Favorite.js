// * Import required modules/dependencies
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {Header, Image, Button, Badge, Icon} from 'react-native-elements';

// * Import all store related stuffs

// * Import all screens/components

// * Import utilites

// * Import all styling stuffs
import mainStyles from '../../styles/mainStyle';
import variables from '../../styles/variables';

class FavoriteScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      favorite: true,
    };
  }

  removeFavorite = () => {};

  render() {
    const favoriteStore = () => {
      return (
        <View style={[mainStyles.row, {marginTop: 10, marginBottom: 10}]}>
          <View style={mainStyles.col3}>
            <Image
              source={{uri: 'https://via.placeholder.com/100'}}
              style={{width: '100%', height: '100%'}}
              PlaceholderContent={<ActivityIndicator />}
            />
          </View>
          <View style={mainStyles.col7}>
            <View>
              <Text style={{fontSize: 18}}>Sellet Store 1</Text>
              <Text style={{color: '#555'}}>
                Dummy Address, ksbc,1234, dto, In
              </Text>
            </View>
            <View style={{marginTop: 10}}>
              <Button title="Shop from this store" type="outline" />
            </View>
          </View>
          <View
            style={[
              mainStyles.col2,
              {justifyContent: 'center', alignItems: 'center'},
            ]}>
            <Icon
              name={`${this.state.favorite ? 'heart' : 'heart-o'}`}
              type="font-awesome"
              size={25}
              onPress={() => {}}
              color={variables.mainThemeColor}
            />
          </View>
        </View>
      );
    };

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
            text: 'My Favorite Stores',
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
          <View style={[mainStyles.container, {marginBottom: 100}]}>
            {favoriteStore()}
            {favoriteStore()}
            {favoriteStore()}
            {favoriteStore()}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({});

const mapStateToProps = state => {
  return {
    cart: state.cart,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FavoriteScreen);
