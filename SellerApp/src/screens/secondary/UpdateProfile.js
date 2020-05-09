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
      profileVerificationDetailCardDisplay: true,
      storeDetailCardDisplay: false,
      bankDetailCardDisplay: false,
      profileVerificationDetail: {
        type: 'aadhar-id',
        number: '',
        document: {
          name: '',
          uri: '',
        },
      },
      storeDetail: {
        name: '',
        address: {
          street: '',
          landmark: '',
          city: '',
          pincode: '',
        },
        panCard: '',
        gstNumber: '',
        document: {
          name: '',
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
        storeDetailCardDisplay: false,
        bankDetailCardDisplay: false,
        profileVerificationDetail: {
          type: 'aadhar-id',
          number: '',
          document: {
            name: '',
            uri: '',
          },
        },
        storeDetail: {
          name: '',
          address: {
            street: '',
            landmark: '',
            city: '',
            pincode: '',
          },
          panCard: '',
          gstNumber: '',
          document: {
            name: '',
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
            uri: '',
          },
        },
      });
    }
  };

  _toggleEditCardDisplay = target => {
    this.setState({[target]: !this.state[target]});
  };

  // TODO: Implement file upload functionality
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
      let data =
        detailType !== 'personalDetail'
          ? {
              ...tempData,
              verified: false,
            }
          : {
              ...tempData,
            };
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
                          style={(mainStyles.col6, {justifyContent: 'center'})}>
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
              </Card>

              <Card
                title={
                  <CardCustomTitle
                    title="Update Your Store Detail"
                    detail
                    onPress={() => {
                      this._toggleEditCardDisplay('storeDetailCardDisplay');
                    }}
                  />
                }>
                <View
                  style={{
                    display: `${
                      this.state.storeDetailCardDisplay ? 'flex' : 'none'
                    }`,
                  }}>
                  <View>
                    <View style={mainStyles.formGroup}>
                      <Input
                        label="Store Name"
                        placeholder="Sangam General Store"
                        value={this.state.storeDetail.name}
                        onChangeText={name => {
                          this.setState({
                            storeDetail: {
                              ...this.state.storeDetail,
                              name,
                            },
                          });
                        }}
                      />
                    </View>

                    <View style={mainStyles.formGroup}>
                      <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                        Address:
                      </Text>
                      <Input
                        label="Street"
                        placeholder="Panki Road"
                        value={this.state.storeDetail.address.street}
                        onChangeText={street => {
                          this.setState({
                            storeDetail: {
                              ...this.state.storeDetail,
                              address: {
                                ...this.state.storeDetail.address,
                                street,
                              },
                            },
                          });
                        }}
                      />
                      <Input
                        label="Landmark"
                        placeholder="near NCC office"
                        value={this.state.storeDetail.address.landmark}
                        onChangeText={landmark => {
                          this.setState({
                            storeDetail: {
                              ...this.state.storeDetail,
                              address: {
                                ...this.state.storeDetail.address,
                                landmark,
                              },
                            },
                          });
                        }}
                      />
                      <Input
                        label="City"
                        placeholder="Daltonganj"
                        value={this.state.storeDetail.address.city}
                        onChangeText={city => {
                          this.setState({
                            storeDetail: {
                              ...this.state.storeDetail,
                              address: {
                                ...this.state.storeDetail.address,
                                city,
                              },
                            },
                          });
                        }}
                      />
                      <Input
                        label="Pincode"
                        placeholder="822134"
                        keyboardType="numeric"
                        value={this.state.storeDetail.address.pincode}
                        onChangeText={pincode => {
                          this.setState({
                            storeDetail: {
                              ...this.state.storeDetail,
                              address: {
                                ...this.state.storeDetail.address,
                                pincode,
                              },
                            },
                          });
                        }}
                      />
                    </View>

                    <View style={mainStyles.formGroup}>
                      <Input
                        label="PAN Card Number"
                        placeholder="DNAPXXXX0J"
                        value={this.state.storeDetail.panCard}
                        onChangeText={panCard => {
                          this.setState({
                            storeDetail: {
                              ...this.state.storeDetail,
                              panCard,
                            },
                          });
                        }}
                      />
                    </View>

                    <View style={mainStyles.formGroup}>
                      <Input
                        label="GST Number"
                        placeholder="36ARVPSXXXXF1ZF"
                        value={this.state.storeDetail.gstNumber}
                        onChangeText={gstNumber => {
                          this.setState({
                            storeDetail: {
                              ...this.state.storeDetail,
                              gstNumber,
                            },
                          });
                        }}
                      />
                    </View>
                    <View style={mainStyles.formGroup}>
                      <Input
                        label="GST Number"
                        placeholder="36ARVPSXXXXF1ZF"
                        value={this.state.storeDetail.gstNumber}
                        onChangeText={gstNumber => {
                          this.setState({
                            storeDetail: {
                              ...this.state.storeDetail,
                              gstNumber,
                            },
                          });
                        }}
                      />
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
                              storeDetailCardDisplay: false,
                              storeDetail: {
                                name: '',
                                address: {
                                  street: '',
                                  landmark: '',
                                  city: '',
                                  pincode: '',
                                },
                                panCard: '',
                                gstNumber: '',
                                // document: {
                                //   name: '',
                                //   uri: '',
                                // },
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
                            this._updateDetail('storeDetail');
                          }}
                          loading={this.props.profile.profileUpdating}
                        />
                      </View>
                    </View>
                  </View>
                </View>
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
                              bankDetail: {
                                name: '',
                                accountNumber: '',
                                ifscCode: '',
                                branchName: '',
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
