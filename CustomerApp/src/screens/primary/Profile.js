// * Import required modules/dependencies
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {
  ScrollView,
  StyleSheet,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {
  Header,
  Card,
  Text,
  Button,
  Avatar,
  Badge,
  Icon,
} from 'react-native-elements';

// * Import all store related stuffs
import * as ProfileActions from '../../store/actions/creators/ProfileActions';

// * Import all screens/components
import Address from '../../components/Address';
import CardCustomTitle from '../../components/CardCustomTitle';

// * Import utilites
import {obtainAddressInString} from '../../utils/helper';

// * Import all styling stuffs
import mainStyles from '../../styles/mainStyle';
import variables from '../../styles/variables';

class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View>
        <Header
          leftComponent={
            <Icon
              type="font-awesome"
              name="bars"
              size={20}
              color="#FFF"
              underlayColor="transparent"
              onPress={() => {
                this.props.navigation.toggleDrawer();
              }}
            />
          }
          centerComponent={{
            text: 'My Profile',
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
          ) : (
            <View style={[mainStyles.container, {marginBottom: 100}]}>
              <Card containerStyle={{borderRadius: 10}}>
                <View style={{alignItems: 'flex-end', display: 'none'}}>
                  <Icon
                    type="font-awesome"
                    name="pencil"
                    size={25}
                    color={variables.mainThemeColor}
                    containerStyle={{padding: 10}}
                    onPress={() => {
                      this.props.navigation.navigate('update-profile-screen');
                    }}
                  />
                </View>
                <View style={mainStyles.alignCenter}>
                  <Avatar
                    size="large"
                    title="RP"
                    rounded
                    source={require('../../assets/images/boy.png')}
                  />
                </View>
                <View style={{marginTop: 20, alignItems: 'center'}}>
                  <Text style={styles.title}>
                    {this.props.profile.profile.personalDetail.firstName +
                      ' ' +
                      this.props.profile.profile.personalDetail.lastName}
                  </Text>
                  <Text style={styles.subTitle}>
                    {this.props.profile.profile.personalDetail.phone}
                  </Text>
                  {/* <Text style={styles.subTitle}>
                    {this.props.profile.profile.personalDetail.email}
                  </Text> */}
                </View>
              </Card>

              <Card
                containerStyle={{borderRadius: 10, alignItems: 'center'}}
                title={
                  <CardCustomTitle
                    title="Your address"
                    type="edit"
                    detail={this.props.profile.profile.personalDetail}
                    onPress={() => {
                      this.props.navigation.navigate('update-profile-screen');
                    }}
                  />
                }>
                {!this.props.profile.profile.address ? (
                  <View>
                    <Text
                      style={{
                        marginBottom: 20,
                        fontSize: 20,
                        color: 'red',
                      }}>
                      No address added in your profile
                    </Text>
                    <Button
                      title="Add your address now"
                      type="outline"
                      titleStyle={{color: variables.mainThemeColor}}
                      buttonStyle={mainStyles.outlineBtn}
                      onPress={() => {
                        this.props.navigation.navigate('update-profile-screen');
                      }}
                    />
                  </View>
                ) : (
                  <View>
                    <Address
                      type={this.props.profile.profile.address.type}
                      value={obtainAddressInString(
                        this.props.profile.profile.address,
                      )}
                    />
                  </View>
                )}
              </Card>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 25,
    marginLeft: 10,
    color: variables.mainFontColor,
  },
  subTitle: {
    fontSize: 20,
    marginLeft: 10,
    color: variables.secFontColor,
  },
});

const mapStateToProps = state => {
  return {
    auth: state.auth,
    cart: state.cart,
    profile: state.profile,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({...ProfileActions}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfileScreen);
