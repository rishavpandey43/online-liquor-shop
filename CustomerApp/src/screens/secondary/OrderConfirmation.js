// * Import required modules/dependencies
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {ScrollView, View, BackHandler, Alert} from 'react-native';
import {Header, Card, Text, Button} from 'react-native-elements';

// * Import all store related stuffs
import * as CartActions from '../../store/actions/creators/CartActions';
import * as OrderActions from '../../store/actions/creators/OrderActions';

// * Import all screens/components

// * Import utilites

// * Import all styling stuffs
import mainStyles from '../../styles/mainStyle';
import variables from '../../styles/variables';

class OrderConfirmationScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeRemaining: 5,
    };
  }

  componentDidMount() {
    this.props.getCartDetailFetch(this.props.auth.authToken);
    this.props.getOrdersFetch(this.props.auth.authToken);
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <Header
          centerComponent={{
            text: '',
            style: {color: '#fff'},
          }}
          containerStyle={{
            backgroundColor: '#933dd4',
            justifyContent: 'space-around',
          }}
        />
        <ScrollView>
          <View style={mainStyles.container}>
            <Card title="Success" containerStyle={{alignItems: 'center'}}>
              <Text style={{marginBottom: 20, fontSize: 20, color: 'green'}}>
                {`Hello ${this.props.profile.profile.personalDetail.firstName +
                  ' ' +
                  this.props.profile.profile.personalDetail
                    .lastName}, You're order has been placed successfully. You'll be updated once it's processed.`}
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
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = ({auth, profile, cart, orders}) => {
  return {
    auth,
    profile,
    cart,
    orders,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({...CartActions, ...OrderActions}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OrderConfirmationScreen);
