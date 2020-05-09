// * Import required modules/dependencies
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {View, Text, Alert, ToastAndroid} from 'react-native';
import {Card, Input, Button} from 'react-native-elements';
import axios from 'axios';
import messaging from '@react-native-firebase/messaging';

// * Import all store related stuffs
import * as AuthActions from '../../store/actions/creators/AuthActions';

// * Import all screens/components

// * Import utilites
import {getDataFromAsync} from '../../utils/helper';
import {baseUrl, authTokenName} from '../../utils/constant';

// * Import all styling stuffs
import mainStyles from '../../styles/mainStyle';
import variables from '../../styles/variables';

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tempPhone: '',
      phoneOTP: '',
      otpLoading: false,
      displayPhoneOTPField: false,
      fcmDeviceToken: null,
    };
  }

  componentDidMount() {
    getDataFromAsync(authTokenName)
      .then(token => {
        this.props.getTokenFromAsync(token);
      })
      .catch(err => {
        console.log(err);
      });
    messaging()
      .getToken()
      .then(token => {
        this.setState({fcmDeviceToken: token});
      });
  }

  _resetState = () => {
    this.setState({
      tempPhone: '',
      phoneOTP: '',
      authyId: '',
      otpLoading: false,
      displayPhoneOTPField: false,
    });
  };

  _requestOTP = () => {
    var phoneRegex = /[6-9][0-9]{9}/;
    if (!phoneRegex.test(this.state.tempPhone)) {
      Alert.alert(
        'Input Invalid',
        'Input valid 10 digit mobile number to continue',
      );
      return;
    } else {
      this.setState({otpLoading: true});
      axios
        .get(baseUrl + '/seller/request-phone-otp-login', {
          params: {
            phone: this.state.tempPhone,
          },
        })
        .then(res => {
          ToastAndroid.show(
            'OTP sent to your entered phone number',
            ToastAndroid.LONG,
          );
          this.setState({
            authyId: res.data.authyId,
            displayPhoneOTPField: true,
          });
        })
        .catch(err => {
          console.log(err.response);
          ToastAndroid.show(
            err.response
              ? err.response.status != 500
                ? err.response.data.errMessage
                : 'Some error occured, try again.'
              : 'Some error occured, try again.',
            ToastAndroid.LONG,
          );
          this._resetState();
        });
    }
  };

  _login = () => {
    var phoneRegex = /[6-9][0-9]{9}/;
    if (!phoneRegex.test(this.state.tempPhone)) {
      Alert.alert(
        'Input Invalid',
        'Input valid 10 digit mobile number to continue',
      );
      return;
    } else if (this.state.phoneOTP === '') {
      Alert.alert('Input Invalid', 'Enter OTP to continue');
    } else {
      this.setState({otpLoading: true});
      let data = {
        phone: this.state.tempPhone,
        otp: this.state.phoneOTP,
      };
      this.props.loginFetch(this.state.fcmDeviceToken, data);
    }
  };

  render() {
    return (
      <View style={{justifyContent: 'center', height: '100%'}}>
        <Card title="Login to continue">
          <View>
            <View>
              {!this.state.displayPhoneOTPField ? (
                <View>
                  <View style={mainStyles.formGroup}>
                    <Input
                      label="Phone number"
                      keyboardType="numeric"
                      placeholder="97735XXXX0"
                      value={this.state.tempPhone}
                      onChangeText={text => {
                        this.setState({tempPhone: text});
                      }}
                    />
                  </View>
                  <View
                    style={[mainStyles.formGroup, {alignItems: 'flex-start'}]}>
                    <Button
                      title="Get OTP for phone"
                      titleStyle={{color: variables.mainThemeColor}}
                      type="outline"
                      buttonStyle={mainStyles.outlineBtn}
                      onPress={this._requestOTP.bind(null)}
                      loading={this.state.otpLoading}
                      containerStyle={{minWidth: '50%'}}
                    />
                  </View>
                </View>
              ) : (
                <View>
                  <View style={mainStyles.formGroup}>
                    <Input
                      label="OTP for Phone"
                      keyboardType="numeric"
                      placeholder="123456"
                      value={this.state.phoneOTP}
                      onChangeText={text => {
                        this.setState({phoneOTP: text});
                      }}
                    />
                  </View>
                  {/* <View
                    style={[mainStyles.formGroup, {alignItems: 'flex-start'}]}>
                    <Button
                      title="Resend OTP to phone"
                      titleStyle={{color: variables.mainThemeColor}}
                      type="outline"
                      buttonStyle={mainStyles.outlineBtn}
                    />
                  </View> */}
                </View>
              )}
            </View>
            <View
              style={[
                mainStyles.row,
                {
                  marginBottom: 20,
                  paddingTop: 20,
                  marginTop: 15,
                },
              ]}>
              <View style={mainStyles.col6}>
                <Button
                  title="Cancel"
                  titleStyle={{color: variables.mainThemeColor}}
                  type="outline"
                  buttonStyle={mainStyles.outlineBtn}
                  onPress={this._resetState.bind(null)}
                />
              </View>
              <View style={mainStyles.col6}>
                <Button
                  title="Login"
                  titleStyle={{color: variables.mainThemeColor}}
                  type="outline"
                  buttonStyle={mainStyles.outlineBtn}
                  onPress={this._login.bind(null)}
                  loading={this.props.auth.isLoading}
                />
              </View>
            </View>
          </View>
        </Card>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({...AuthActions}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginScreen);
