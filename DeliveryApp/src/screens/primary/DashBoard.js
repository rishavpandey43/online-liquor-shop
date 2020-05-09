// * Import required modules/dependencies
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {ScrollView, StyleSheet, View, Text, Button, Alert} from 'react-native';
import {Header, Card, Icon} from 'react-native-elements';
import messaging from '@react-native-firebase/messaging';

// * Import all store related stuffs
import * as ProfileActions from '../../store/actions/creators/ProfileActions';
import * as AuthActions from '../../store/actions/creators/AuthActions';
import * as OrderActions from '../../store/actions/creators/OrdersActions';

// * Import all screens/components

// * Import utilites
import {getDataFromAsync} from '../../utils/helper';
import {authTokenName} from '../../utils/constant';

// * Import all styling stuffs
import mainStyles from '../../styles/mainStyle';

class DashBoardScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    getDataFromAsync(authTokenName)
      .then(token => {
        this.props.getTokenFromAsync(token);
        this.props.getProfileFetch(this.props.auth.authToken);
        this.props.getOrdersFetch(this.props.auth.authToken);
      })
      .catch(err => {
        console.log(err);
      });

    const permissionStatus = messaging().hasPermission();
    const permissionGranted = messaging().requestPermission();

    const messageListener = () => {
      messaging().onMessage(message => {
        Alert.alert(
          message.notification.title,
          `Hello ${
            this.props.profile.profile
              ? `${this.props.profile.profile.personalDetail.firstName} ${
                  this.props.profile.profile.personalDetail.lastName
                }, `
              : ''
          } ${message.notification.body}`,
          [
            {
              text: 'View more detail',
              onPress: () => {
                if (message.notification.title === 'New Order') {
                  this.props.navigation.navigate('deliver-new-order-stack');
                } else {
                  this.props.getOrdersFetch(this.props.auth.authToken);
                  this.props.navigation.navigate('orders-stack');
                }
                return;
              },
            },
          ],
        );
      });

      messaging().onNotificationOpenedApp(notification => {
        if (notification.title === 'New Order') {
          this.props.navigation.navigate('deliver-new-order-stack');
        } else {
          this.props.getOrdersFetch(this.props.auth.authToken);
          this.props.navigation.navigate('orders-stack');
        }
      });

      messaging().getInitialNotification(notification => {
        if (notification.title === 'New Order') {
          this.props.navigation.navigate('deliver-new-order-stack');
        } else {
          this.props.getOrdersFetch(this.props.auth.authToken);
          this.props.navigation.navigate('orders-stack');
        }
      });
    };

    permissionStatus
      .then(res => {
        messageListener();
      })
      .catch(err => {
        permissionGranted
          .then(res => {})
          .catch(err => {
            console.log('User canceled the permission');
          });
      });
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
            text: 'YOUR DASHBOARD',
            style: {color: '#fff'},
          }}
          rightComponent={
            <Icon name="dashboard" type="font-awesome" color="#FFF" size={30} />
          }
          containerStyle={{
            backgroundColor: '#933dd4',
            justifyContent: 'space-around',
          }}
        />
        <ScrollView>
          <View style={[mainStyles.container, {marginBottom: 100}]}>
            <Card title="Notification">
              <Text style={{margin: 20, padding: 10, fontSize: 18}}>
                Your Dashboard is under construction, You'll be updated soon.
              </Text>
              <Text style={{margin: 20, padding: 10, fontSize: 18}}>
                Thank you for your patience.
              </Text>
            </Card>
            {/* <View style={mainStyles.row}>
              <View style={mainStyles.col6}>
                <Card title="Total Orders">
                  <Text>50</Text>
                </Card>
              </View>
              <View style={mainStyles.col6}>
                <Card title="Today's Orders">
                  <Text>50</Text>
                </Card>
              </View>
            </View>
            <View style={mainStyles.row}>
              <View style={mainStyles.col6}>
                <Card title="Order's Processing">
                  <Text>50</Text>
                </Card>
              </View>
              <View style={mainStyles.col6}>
                <Card title="Order's Processed">
                  <Text>50</Text>
                </Card>
              </View>
            </View>
            <View style={mainStyles.row}>
              <View style={mainStyles.col6}>
                <Card title="Total Payment Received">
                  <Text>50</Text>
                </Card>
              </View>
              <View style={mainStyles.col6}>
                <Card title="Total Payment Pending">
                  <Text>50</Text>
                </Card>
              </View>
            </View> */}
          </View>
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
  return bindActionCreators(
    {...AuthActions, ...ProfileActions, ...OrderActions},
    dispatch,
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DashBoardScreen);
