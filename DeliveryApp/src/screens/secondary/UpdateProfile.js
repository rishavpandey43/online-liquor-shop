// * Import required modules/dependencies
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {
  ScrollView,
  StyleSheet,
  View,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  Header,
  Card,
  Button,
  Text,
  Input,
  Icon,
  CheckBox,
} from 'react-native-elements';
import DocumentPicker from 'react-native-document-picker';

// * Import all store related stuffs
import * as AuthActions from '../../store/actions/creators/AuthActions';
import * as ProfileActions from '../../store/actions/creators/ProfileActions';

// * Import all screens/components
import CardCustomTitle from '../../components/CardCustomTitle';

// * Import utilites
import {getVerificationDocumentName} from '../../utils/helper';

// * Import all styling stuffs
import variables from '../../styles/variables';
import mainStyles from '../../styles/mainStyle';

class UpdateProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      personalDetailCardDisplay: false,
      profileVerificationDetailCardDisplay: false,
      vehicleDetailCardDisplay: false,
      bankDetailCardDisplay: false,
      profileVerificationDetail: {
        type: 'aadhar-id',
        number: '',
        document: {
          name: '',
          type: '',
          uri: '',
        },
      },
      vehicleDetail: {
        drivingLicence: '',
        vehicleModel: '',
        document: {
          name: '',
          type: '',
          uri: '',
        },
      },
      bankDetail: {
        name: '',
        accountNumber: '',
        ifscCode: '',
        branchName: '',
        document: {
          name: '',
          type: '',
          uri: '',
        },
      },
    };
  }

  componentDidUpdate = prevProps => {
    if (
      prevProps.profile.profile.updatedAt !=
      this.props.profile.profile.updatedAt
    ) {
      this.setState({
        personalDetailCardDisplay: false,
        profileVerificationDetailCardDisplay: false,
        vehicleDetailCardDisplay: false,
        bankDetailCardDisplay: false,
        profileVerificationDetail: {
          type: 'aadhar-id',
          number: '',
          document: {
            name: '',
            type: '',
            uri: '',
          },
        },
        vehicleDetail: {
          drivingLicence: '',
          vehicleModel: '',
          document: {
            name: '',
            type: '',
            uri: '',
          },
        },
        bankDetail: {
          name: '',
          accountNumber: '',
          ifscCode: '',
          branchName: '',
          document: {
            name: '',
            type: '',
            uri: '',
          },
        },
      });
    }
  };

  _toggleEditCardDisplay = target => {
    this.setState({[target]: !this.state[target]});
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
                    title="Update Your Vehicle Detail"
                    detail
                    onPress={() => {
                      this._toggleEditCardDisplay('vehicleDetailCardDisplay');
                    }}
                  />
                }>
                {this.props.profile.profile.vehicleDetail &&
                this.props.profile.profile.vehicleDetail.verification ===
                  'pen' ? (
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
                        this.state.vehicleDetailCardDisplay ? 'flex' : 'none'
                      }`,
                    }}>
                    <View style={mainStyles.formGroup}>
                      <Input
                        label="Driving licence number"
                        placeholder="JP-14-20-0062821"
                        value={this.state.vehicleDetail.drivingLicence}
                        onChangeText={drivingLicence => {
                          this.setState({
                            vehicleDetail: {
                              ...this.state.vehicleDetail,
                              drivingLicence,
                            },
                          });
                        }}
                      />
                    </View>

                    <View style={mainStyles.formGroup}>
                      <Input
                        label="Vehicle Model"
                        placeholder="Yamaha FZ25"
                        value={this.state.vehicleDetail.vehicleModel}
                        onChangeText={vehicleModel => {
                          this.setState({
                            vehicleDetail: {
                              ...this.state.vehicleDetail,
                              vehicleModel,
                            },
                          });
                        }}
                      />
                    </View>

                    <View style={mainStyles.formGroup}>
                      <Text style={mainStyles.formLabel}>
                        Enter scanned documents of vehicle detail in pdf format
                      </Text>
                      <View style={mainStyles.row}>
                        <View style={mainStyles.col6}>
                          <Button
                            title="Choose file"
                            titleStyle={{color: variables.mainThemeColor}}
                            type="clear"
                            onPress={this._uploadDocument.bind(
                              null,
                              'vehicleDetail',
                            )}
                          />
                        </View>
                        <View
                          style={(mainStyles.col6, {justifyContent: 'center'})}>
                          <Text>
                            {this.state.vehicleDetail.document.name ||
                              'No file choosen'}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={mainStyles.formGroup}>
                      <View>
                        <View style={[mainStyles.row, {marginBottom: 10}]}>
                          <View style={mainStyles.col6}>
                            <Button
                              title="Cancel"
                              titleStyle={{color: variables.mainThemeColor}}
                              type="outline"
                              buttonStyle={mainStyles.outlineBtn}
                              onPress={() => {
                                this.setState({
                                  vehicleDetailCardDisplay: false,
                                  vehicleDetail: {
                                    drivingLicence: '',
                                    vehicleModel: '',
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
                                this._updateDetail('vehicleDetail');
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
                    title="Update Your Bank Detail"
                    detail
                    onPress={() => {
                      this._toggleEditCardDisplay('bankDetailCardDisplay');
                    }}
                  />
                }>
                {this.props.profile.profile.bankDetail &&
                this.props.profile.profile.bankDetail.verification === 'pen' ? (
                  <View>
                    <Text>
                      You've filled the detail, please wait for it's
                      verification.
                    </Text>
                  </View>
                ) : (
                  <View
                    style={{
                      display: `${
                        this.state.bankDetailCardDisplay ? 'flex' : 'none'
                      }`,
                    }}>
                    <View>
                      <View style={mainStyles.formGroup}>
                        <Input
                          label="Bank Name"
                          placeholder="State Bank of India"
                          value={this.state.bankDetail.name}
                          onChangeText={name => {
                            this.setState({
                              bankDetail: {
                                ...this.state.bankDetail,
                                name,
                              },
                            });
                          }}
                        />
                      </View>

                      <View style={mainStyles.formGroup}>
                        <Input
                          label="Account Number"
                          keyboardType="numeric"
                          placeholder="203XXXXXXX1"
                          value={this.state.bankDetail.accountNumber}
                          onChangeText={accountNumber => {
                            this.setState({
                              bankDetail: {
                                ...this.state.bankDetail,
                                accountNumber,
                              },
                            });
                          }}
                        />
                      </View>

                      <View style={mainStyles.formGroup}>
                        <Input
                          label="IFSC Code"
                          placeholder="SBXXXXXXX45"
                          value={this.state.bankDetail.ifscCode}
                          onChangeText={ifscCode => {
                            this.setState({
                              bankDetail: {
                                ...this.state.bankDetail,
                                ifscCode,
                              },
                            });
                          }}
                        />
                      </View>

                      <View style={mainStyles.formGroup}>
                        <Input
                          label="Branch Name"
                          placeholder="XYZ branch"
                          value={this.state.bankDetail.branchName}
                          onChangeText={branchName => {
                            this.setState({
                              bankDetail: {
                                ...this.state.bankDetail,
                                branchName,
                              },
                            });
                          }}
                        />
                      </View>

                      <View style={mainStyles.formGroup}>
                        <Text style={mainStyles.formLabel}>
                          Enter scanned documents of bank detail in pdf format
                        </Text>
                        <View style={mainStyles.row}>
                          <View style={mainStyles.col6}>
                            <Button
                              title="Choose file"
                              titleStyle={{color: variables.mainThemeColor}}
                              type="clear"
                              onPress={this._uploadDocument.bind(
                                null,
                                'bankDetail',
                              )}
                            />
                          </View>
                          <View
                            style={
                              (mainStyles.col6, {justifyContent: 'center'})
                            }>
                            <Text>
                              {this.state.bankDetail.document.name ||
                                'No file choosen'}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>

                    <View>
                      <View style={[mainStyles.row, {marginBottom: 20}]}>
                        <View style={mainStyles.col6}>
                          <Button
                            title="Cancel"
                            titleStyle={{color: variables.mainThemeColor}}
                            type="outline"
                            buttonStyle={mainStyles.outlineBtn}
                            onPress={() => {
                              this.setState({
                                bankDetailCardDisplay: false,
                                name: '',
                                accountNumber: '',
                                ifscCode: '',
                                branchName: '',
                                document: {
                                  name: '',
                                  type: '',
                                  uri: '',
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
                              this._updateDetail('bankDetail');
                            }}
                            loading={this.props.profile.profileUpdating}
                          />
                        </View>
                      </View>
                    </View>
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

const styles = StyleSheet.create({});

const mapStateToProps = state => {
  return {
    auth: state.auth,
    profile: state.profile,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({...AuthActions, ...ProfileActions}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UpdateProfileScreen);
