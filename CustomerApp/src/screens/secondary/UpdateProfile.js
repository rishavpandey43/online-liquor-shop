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
import DateTimePicker from '@react-native-community/datetimepicker';
import DocumentPicker from 'react-native-document-picker';

// * Import all store related stuffs
import * as ProfileActions from '../../store/actions/creators/ProfileActions';

// * Import all screens/components
import CardCustomTitle from '../../components/CardCustomTitle';

// * Import utilites
import {
  getVerificationStatus,
  getVerificationDocumentName,
} from '../../utils/helper';

// * Import all styling stuffs
import mainStyles from '../../styles/mainStyle';
import variables from '../../styles/variables';

class UpdateProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDateTimePicker: false,
      profileVerificationDetailCardDisplay: true,
      addressCardDisplay: false,
      profileVerificationDetail: {
        dob: new Date(),
        type: 'aadhar-id',
        number: '',
        document: {
          name: '',
          type: '',
          uri: '',
        },
      },
      address: {
        street: '',
        landmark: '',
        city: '',
        pincode: '',
        type: 'home',
      },
    };
  }

  _toggleEditCardDisplay = target => {
    this.setState({[target]: !this.state[target]});
  };

  _toggleDateTimePicker = () => {
    this.setState({showDateTimePicker: !this.state.showDateTimePicker});
  };

  _uploadDocument = async type => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      this.setState({
        [type]: {
          ...this.state[type],
          document: {
            name: result.name,
            type: result.type,
            uri: result.uri,
          },
        },
      });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  _updateDetail = detailType => {
    let tempData = this.state[detailType];
    let isEmpty = false;
    for (const item in tempData) {
      if (typeof tempData[item] == 'string') {
        if (tempData[item] == '') {
          isEmpty = true;
        }
      } else {
        for (const key in tempData[item]) {
          if (tempData[item][key] == '') {
            isEmpty = true;
          }
        }
      }
    }
    if (isEmpty) {
      Alert.alert('Input Invalid', 'Please fill all the details to continue.');
      return;
    } else {
      let data = {};

      for (const key in tempData) {
        if (key != 'document') {
          data[key] = tempData[key];
        }
      }
      data =
        detailType !== 'personalDetail'
          ? {
              ...data,
              verification: 'pen',
            }
          : {
              ...data,
            };
      this.props.updateProfileFetch(
        this.props.auth.authToken,
        data,
        detailType,
        tempData.document,
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
              <Card
                title={
                  <CardCustomTitle
                    title="Update Your Profile Verification Detail"
                    detail
                    onPress={() => {
                      this._toggleEditCardDisplay(
                        'profileVerificationDetailCardDisplay',
                      );
                    }}
                  />
                }>
                {this.props.profile.profile.profileVerificationDetail &&
                this.props.profile.profile.profileVerificationDetail
                  .verification === 'pen' ? (
                  <View>
                    <Text>
                      You've filled the detail, please wait for it's
                      verification to complete.
                    </Text>
                  </View>
                ) : (
                  <View
                    style={{
                      display: `${
                        this.state.profileVerificationDetailCardDisplay
                          ? 'flex'
                          : 'none'
                      }`,
                    }}>
                    <View>
                      <View style={mainStyles.formGroup}>
                        <Text style={mainStyles.formLabel}>
                          Your Date of Birth
                        </Text>
                        <View style={mainStyles.row}>
                          <View style={{flex: 1}}>
                            <Button
                              title="Select your date of Birth"
                              titleStyle={{color: variables.mainThemeColor}}
                              type="clear"
                              onPress={this._toggleDateTimePicker.bind(null)}
                            />
                          </View>
                          <View style={{flex: 1, justifyContent: 'center'}}>
                            <Text>
                              {this.state.profileVerificationDetail.dob
                                .toDateString()
                                .toString() || 'No date selected'}
                            </Text>
                          </View>
                        </View>
                        {this.state.showDateTimePicker && (
                          <DateTimePicker
                            testID="dateTimePicker"
                            timeZoneOffsetInMinutes={0}
                            value={this.state.profileVerificationDetail.dob}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                              this.setState({
                                profileVerificationDetail: {
                                  ...this.state.profileVerificationDetail,
                                  dob: selectedDate || new Date(),
                                },
                                showDateTimePicker: false,
                              });
                            }}
                          />
                        )}
                      </View>

                      <View style={mainStyles.formGroup}>
                        <Text style={mainStyles.formLabel}>Document type:</Text>
                        <View style={mainStyles.row}>
                          <View style={{flex: 1}}>
                            <CheckBox
                              containerStyle={{
                                backgroundColor: 'transparent',
                                borderColor: 'transparent',
                              }}
                              center
                              title="Aadhar Card"
                              checkedIcon="dot-circle-o"
                              uncheckedIcon="circle-o"
                              checkedColor={variables.mainThemeColor}
                              checked={
                                this.state.profileVerificationDetail.type ===
                                'aadhar-id'
                              }
                              onPress={() => {
                                this.setState({
                                  profileVerificationDetail: {
                                    ...this.state.profileVerificationDetail,
                                    type: 'aadhar-id',
                                  },
                                });
                              }}
                            />
                          </View>
                          <View style={{flex: 1}}>
                            <CheckBox
                              containerStyle={{
                                backgroundColor: 'transparent',
                                borderColor: 'transparent',
                              }}
                              center
                              title="Voter ID Card"
                              checkedIcon="dot-circle-o"
                              uncheckedIcon="circle-o"
                              checkedColor={variables.mainThemeColor}
                              checked={
                                this.state.profileVerificationDetail.type ===
                                'voter-id'
                              }
                              onPress={() => {
                                this.setState({
                                  profileVerificationDetail: {
                                    ...this.state.profileVerificationDetail,
                                    type: 'voter-id',
                                  },
                                });
                              }}
                            />
                          </View>
                        </View>
                      </View>

                      <View style={mainStyles.formGroup}>
                        <Input
                          label={`${getVerificationDocumentName(
                            this.state.profileVerificationDetail.type,
                          )} number`}
                          placeholder={`Enter valid ${getVerificationDocumentName(
                            this.state.profileVerificationDetail.type,
                          )} number`}
                          value={this.state.profileVerificationDetail.number}
                          onChangeText={number => {
                            this.setState({
                              profileVerificationDetail: {
                                ...this.state.profileVerificationDetail,
                                number,
                              },
                            });
                          }}
                        />
                      </View>

                      <View style={mainStyles.formGroup}>
                        <Text
                          style={
                            mainStyles.formLabel
                          }>{`Enter scanned ${getVerificationDocumentName(
                          this.state.profileVerificationDetail.type,
                        )} in pdf format`}</Text>
                        <View style={mainStyles.row}>
                          <View style={mainStyles.col6}>
                            <Button
                              title="Choose file"
                              titleStyle={{color: variables.mainThemeColor}}
                              type="clear"
                              onPress={this._uploadDocument.bind(
                                null,
                                'profileVerificationDetail',
                              )}
                            />
                          </View>
                          <View
                            style={
                              (mainStyles.col6, {justifyContent: 'center'})
                            }>
                            <Text>
                              {this.state.profileVerificationDetail.document
                                .name || 'No file choosen'}
                            </Text>
                          </View>
                        </View>
                      </View>

                      <View style={mainStyles.formGroup}>
                        <View style={[mainStyles.row, {marginBottom: 10}]}>
                          <View style={mainStyles.col6}>
                            <Button
                              title="Cancel"
                              titleStyle={{color: variables.mainThemeColor}}
                              type="outline"
                              buttonStyle={mainStyles.outlineBtn}
                              onPress={() => {
                                this.setState({
                                  profileVerificationDetailCardDisplay: false,
                                  profileVerificationDetail: {
                                    type: 'aadhar-id',
                                    number: '',
                                    document: {
                                      name: '',
                                      type: '',
                                      uri: '',
                                    },
                                  },
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
                                this._updateDetail('profileVerificationDetail');
                              }}
                              loading={this.props.profile.profileUpdating}
                            />
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                )}
              </Card>

              <Card
                title={
                  <CardCustomTitle
                    title="Update your address"
                    detail
                    onPress={() => {
                      this._toggleEditCardDisplay('addressCardDisplay');
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
                              addressCardDisplay: false,
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
                            this._updateDetail('address');
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
