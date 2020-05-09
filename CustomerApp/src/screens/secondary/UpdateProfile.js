// * Import required modules/dependencies
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {
  ScrollView,
  StyleSheet,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  Header,
  Card,
  Text,
  Button,
  Icon,
  Input,
  CheckBox,
} from 'react-native-elements';

// * Import all store related stuffs
import * as ProfileActions from '../../store/actions/creators/ProfileActions';

// * Import all screens/components
import CardCustomTitle from '../../components/CardCustomTitle';

// * Import utilites

// * Import all styling stuffs
import mainStyles from '../../styles/mainStyle';
import variables from '../../styles/variables';

class UpdateProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      personalDetailCardDisplay: false,
      addressCardDisplay: false,
      personalDetail: {},
      address: {
        street: '',
        landmark: '',
        city: '',
        pincode: '',
        type: 'home',
      },
    };
  }

  toggleEditCardDisplay = target => {
    this.setState({[target]: !this.state[target]});
  };

  updateDetail = detailType => {
    let tempData = this.state[detailType];
    let isEmpty = false;
    for (const item in tempData) {
      if (tempData[item] == '') {
        isEmpty = true;
      }
    }
    if (isEmpty) {
      Alert.alert('Input Invalid', 'Please fill all the details to continue.');
      return;
    } else {
      let data = {...tempData};
      this.props.updateProfileFetch(
        this.props.auth.authToken,
        data,
        detailType,
      );
    }
  };

  render() {
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
            />
          }
          centerComponent={{
            text: 'Update Your Profile',
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
          ) : (
            <View style={[mainStyles.container, {marginBottom: 100}]}>
              {/* <Card
                title={
                  <CardCustomTitle
                    title="Update your personal detail"
                    detail={this.props.profile.profile.personalDetail}
                    onPress={() => {
                      this.toggleEditCardDisplay('personalDetailCardDisplay');
                    }}
                  />
                }>
                <View
                  style={{
                    display: `${
                      this.state.personalDetailCardDisplay ? 'flex' : 'none'
                    }`,
                  }}>
                  <View>
                    <View style={mainStyles.formGroup}>
                      <Input label="First Name" placeholder="John" />
                    </View>
                    <View style={mainStyles.formGroup}>
                      <Input label="Last Name" placeholder="Doe" />
                    </View>
                    <View style={mainStyles.formGroup}>
                      <View style={mainStyles.row}>
                        <View style={mainStyles.col8}>
                          <Input label="Email" placeholder="johndoe@john.com" />
                        </View>
                        <View
                          style={[
                            mainStyles.col6,
                            {justifyContent: 'flex-end'},
                          ]}>
                          <Button
                            title="Get OTP"
                            titleStyle={{color: variables.mainThemeColor}}
                            type="outline"
                            buttonStyle={mainStyles.outlineBtn}
                          />
                        </View>
                      </View>
                      <View style={{display: 'none'}}>
                        <Input placeholder="OTP of email" />
                      </View>
                    </View>
                    <View style={mainStyles.formGroup}>
                      <View style={mainStyles.row}>
                        <View style={mainStyles.col8}>
                          <Input
                            label="Mobile Number"
                            placeholder="9876543210"
                          />
                        </View>
                        <View
                          style={[
                            mainStyles.col6,
                            {justifyContent: 'flex-end'},
                          ]}>
                          <Button
                            title="Get OTP"
                            titleStyle={{color: variables.mainThemeColor}}
                            type="outline"
                            buttonStyle={mainStyles.outlineBtn}
                          />
                        </View>
                      </View>
                      <View style={{display: 'none'}}>
                        <Input placeholder="OTP of phone" />
                      </View>
                    </View>
                  </View>
                  <View style={[mainStyles.row, {marginBottom: 20}]}>
                    <View style={mainStyles.col6}>
                      <Button
                        title="Cancel"
                        titleStyle={{color: variables.mainThemeColor}}
                        type="outline"
                        buttonStyle={mainStyles.outlineBtn}
                        onPress={() => {
                          this.setState({
                            personalDetailCardDisplay: false,
                          });
                        }}
                      />
                    </View>
                    <View style={mainStyles.col6}>
                      <Button
                        title="Submit"
                        titleStyle={{color: variables.mainThemeColor}}
                        type="outline"
                        buttonStyle={mainStyles.outlineBtn}
                        onPress={() => {
                          this.updateDetail('personalDetail');
                        }}
                        loading={this.props.profile.profileUpdating}
                      />
                    </View>
                  </View>
                </View>
              </Card> */}

              <Card
                title={
                  <CardCustomTitle
                    title="Update your address"
                    detail={this.props.profile.profile.personalDetail}
                    onPress={() => {
                      this.toggleEditCardDisplay('addressCardDisplay');
                    }}
                  />
                }>
                <View
                  style={{
                    display: `${
                      this.state.addressCardDisplay ? 'flex' : 'none'
                    }`,
                  }}>
                  <View>
                    <View style={mainStyles.formGroup}>
                      <Input
                        label="Street"
                        placeholder="Panki Road"
                        value={this.state.address.street}
                        onChangeText={street => {
                          this.setState({
                            address: {
                              ...this.state.address,
                              street,
                            },
                          });
                        }}
                      />
                    </View>

                    <View style={mainStyles.formGroup}>
                      <Input
                        label="Landmark"
                        placeholder="near NCC office"
                        value={this.state.address.landmark}
                        onChangeText={landmark => {
                          this.setState({
                            address: {
                              ...this.state.address,
                              landmark,
                            },
                          });
                        }}
                      />
                    </View>

                    <View style={mainStyles.formGroup}>
                      <Input
                        label="City"
                        placeholder="Daltonganj"
                        value={this.state.address.city}
                        onChangeText={city => {
                          this.setState({
                            address: {
                              ...this.state.address,
                              city,
                            },
                          });
                        }}
                      />
                    </View>

                    <View style={mainStyles.formGroup}>
                      <Input
                        label="Pincode"
                        placeholder="822134"
                        keyboardType="numeric"
                        value={this.state.address.pincode}
                        onChangeText={pincode => {
                          this.setState({
                            address: {
                              ...this.state.address,
                              pincode,
                              address: {
                                ...this.state.address,
                              },
                            },
                          });
                        }}
                      />
                    </View>

                    <View style={mainStyles.formGroup}>
                      <Text style={mainStyles.formLabel}>Address Type</Text>
                      <View style={mainStyles.row}>
                        <View style={mainStyles.col6}>
                          <CheckBox
                            containerStyle={{
                              backgroundColor: 'transparent',
                              borderColor: 'transparent',
                            }}
                            center
                            title="Home"
                            checkedIcon="dot-circle-o"
                            uncheckedIcon="circle-o"
                            checkedColor={variables.mainThemeColor}
                            checked={this.state.address.type === 'home'}
                            onPress={() => {
                              this.setState({
                                address: {
                                  ...this.state.address,
                                  type: 'home',
                                },
                              });
                            }}
                          />
                        </View>
                        <View style={mainStyles.col6}>
                          <CheckBox
                            containerStyle={{
                              backgroundColor: 'transparent',
                              borderColor: 'transparent',
                            }}
                            center
                            title="Work"
                            checkedIcon="dot-circle-o"
                            uncheckedIcon="circle-o"
                            checkedColor={variables.mainThemeColor}
                            checked={this.state.address.type === 'work'}
                            onPress={() => {
                              this.setState({
                                address: {
                                  ...this.state.address,
                                  type: 'work',
                                },
                              });
                            }}
                          />
                        </View>
                        <View style={mainStyles.col6}>
                          <CheckBox
                            containerStyle={{
                              backgroundColor: 'transparent',
                              borderColor: 'transparent',
                            }}
                            center
                            title="Other"
                            checkedIcon="dot-circle-o"
                            uncheckedIcon="circle-o"
                            checkedColor={variables.mainThemeColor}
                            checked={this.state.address.type === 'other'}
                            onPress={() => {
                              this.setState({
                                address: {
                                  ...this.state.address,
                                  type: 'other',
                                },
                              });
                            }}
                          />
                        </View>
                      </View>
                    </View>

                    <View style={[mainStyles.row, {marginBottom: 20}]}>
                      <View style={mainStyles.col6}>
                        <Button
                          title="Cancel"
                          titleStyle={{color: variables.mainThemeColor}}
                          type="outline"
                          buttonStyle={mainStyles.outlineBtn}
                          onPress={() => {
                            this.setState({
                              personalDetailCardDisplay: false,
                            });
                          }}
                        />
                      </View>
                      <View style={mainStyles.col6}>
                        <Button
                          title="Submit"
                          titleStyle={{color: variables.mainThemeColor}}
                          type="outline"
                          buttonStyle={mainStyles.outlineBtn}
                          onPress={() => {
                            this.updateDetail('address');
                          }}
                          loading={this.props.profile.profileUpdating}
                        />
                      </View>
                    </View>
                  </View>
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
    auth: state.auth,
    profile: state.profile,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({...ProfileActions}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UpdateProfileScreen);
