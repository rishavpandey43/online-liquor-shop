// * Import required modules/dependencies
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {View, Alert, ToastAndroid} from 'react-native';
import {Card, Input, Button} from 'react-native-elements';
import axios from 'axios';
import messaging from '@react-native-firebase/messaging';

// * Import all store related stuffs
import * as AuthActions from '../../store/actions/creators/AuthActions';

// * Import all screens/components

// * Import utilites
import {storeDataInAsync, getDataFromAsync} from '../../utils/helper';

import {baseUrl, authTokenName} from '../../utils/constant';

// * Import all styling stuffs
import mainStyles from '../../styles/mainStyle';
import variables from '../../styles/variables';

class RegisterScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: {
        tempFirstName: '',
        tempLastName: '',
        tempPhone: '',
      },
      phoneOTP: '',
      displayEmailOTPField: false,
      displayPhoneOTPField: false,
      authyId: '',
      otpLoading: false,

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
      detail: {
        tempFirstName: '',
        tempLastName: '',
        tempPhone: '',
      },
      phoneOTP: '',
      displayEmailOTPField: false,
      displayPhoneOTPField: false,
      authyId: '',
      otpLoading: false,
    });
  };

  _requestOTP = () => {
    let isEmpty = false;
    var phoneRegex = /[6-9][0-9]{9}/;
    for (const detail in this.state.detail) {
      if (this.state.detail[detail] === '') {
        isEmpty = true;
      }
    }
    if (isEmpty) {
      Alert.alert('Input Invalid', 'Please fill all the details to continue.');
      return;
    } else if (
      this.state.detail.tempFirstName.length < 3 ||
      this.state.detail.tempLastName.length < 3
    ) {
      Alert.alert(
        'Input Invalid',
        'Lenght of your firstname and last name should be greater than 3',
      );
      return;
    } else if (!phoneRegex.test(this.state.detail.tempPhone)) {
      Alert.alert(
        'Input Invalid',
        'Input valid 10 digit mobile number to continue',
      );
      return;
    } else {
      this.setState({otpLoading: true});
      axios
        .get(baseUrl + '/seller/request-phone-otp-register', {
          params: {
            phone: this.state.detail.tempPhone,
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

  _register = () => {
    let isEmpty = false;
    var phoneRegex = /[6-9][0-9]{9}/;
    for (const detail in this.state.detail) {
      if (this.state.detail[detail] === '') {
        isEmpty = true;
      }
    }
    if (isEmpty) {
      Alert.alert('Input Invalid', 'Please fill all the details to continue.');
      return;
    } else if (
      this.state.detail.tempFirstName.length < 3 ||
      this.state.detail.tempLastName.length < 3
    ) {
      Alert.alert(
        'Input Invalid',
        'Lenght of your firstname and last name should be greater than 3',
      );
      return;
    } else if (!phoneRegex.test(this.state.detail.tempPhone)) {
      Alert.alert(
        'Input Invalid',
        'Input valid 10 digit mobile number to continue',
      );
      return;
    } else if (this.state.phoneOTP === '') {
      Alert.alert('Input Invalid', 'Enter OTP to continue.');
      return;
    } else {
      let data = {
        firstName: this.state.detail.tempFirstName,
        lastName: this.state.detail.tempLastName,
        phone: this.state.detail.tempPhone,
        authyId: this.state.authyId,
        otp: this.state.phoneOTP,
      };
      this.props.registerFetch(this.state.fcmDeviceToken, data);
    }
  };

  render() {
    return (
      <View style={{justifyContent: 'center', height: '100%'}}>
        <Card title="Register your account for free">
          <View>
            <View>
              <View style={mainStyles.formGroup}>
                <Input
                  label="First Name"
                  placeholder="John"
                  value={this.state.detail.tempFirstName}
                  onChangeText={text => {
                    this.setState({
                      detail: {
                        ...this.state.detail,
                        tempFirstName: text,
                      },
                    });
                  }}
                />
              </View>
              <View style={mainStyles.formGroup}>
                <Input
                  label="Last Name"
                  placeholder="Doe"
                  value={this.state.detail.tempLastName}
                  onChangeText={text => {
                    this.setState({
                      detail: {
                        ...this.state.detail,
                        tempLastName: text,
                      },
                    });
                  }}
                />
              </View>
              {/* {!this.state.displayEmailOTPField ? (
                <View>
                  <View style={mainStyles.formGroup}>
                    <Input
                      label="Email"
                      placeholder="johndoe@john.com"
                      value={this.state.detail.tempEmail}
                    />
                  </View>
                  <View
                    style={[mainStyles.formGroup, {alignItems: 'flex-start'}]}>
                    <Button
                      title="Get OTP for email"
                      titleStyle={{color: variables.mainThemeColor}}
                      type="outline"
                      buttonStyle={mainStyles.outlineBtn}
                    />
                  </View>
                </View>
              ) : (
                <View>
                  <View style={mainStyles.formGroup}>
                    <Input
                      keyboardType="numeric"
                      label="OTP for Email"
                      placeholder="123456"
                      value={this.state.emailOTP}
                    />
                  </View>
                  <View
                    style={[mainStyles.formGroup, {alignItems: 'flex-start'}]}>
                    <Button
                      title="Resend OTP to email"
                      titleStyle={{color: variables.mainThemeColor}}
                      type="outline"
                      buttonStyle={mainStyles.outlineBtn}
                    />
                  </View>
                </View>
              )} */}

              {!this.state.displayPhoneOTPField ? (
                <View>
                  <View style={mainStyles.formGroup}>
                    <Input
                      label="Phone number"
                      keyboardType="numeric"
                      placeholder="97735XXXX0"
                      value={this.state.detail.tempPhone}
                      onChangeText={text => {
                        this.setState({
                          detail: {
                            ...this.state.detail,
                            tempPhone: text,
                          },
                        });
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
                        this.setState({
                          phoneOTP: text,
                        });
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
                  title="Register"
                  titleStyle={{color: variables.mainThemeColor}}
                  type="outline"
                  buttonStyle={mainStyles.outlineBtn}
                  onPress={this._register.bind(null)}
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
)(RegisterScreen);
