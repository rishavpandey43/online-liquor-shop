// * Import required modules/dependencies
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {View, ScrollView} from 'react-native';
import {
  Text,
  Header,
  Card,
  ListItem,
  Overlay,
  CheckBox,
  Input,
  Button,
  Icon,
} from 'react-native-elements';
import axios from 'axios';

// * Import all store related stuffs
import * as AuthActions from '../../store/actions/creators/AuthActions';

// * Import all screens/components

// * Import utilites
import {getDataFromAsync} from '../../utils/helper';

import {baseUrl} from '../../utils/constant';

// * Import all styling stuffs
import mainStyles from '../../styles/mainStyle';
import variables from '../../styles/variables';

class SettingScreen extends Component {
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
            text: 'Your Setting',
            style: {color: '#fff'},
          }}
          containerStyle={{
            backgroundColor: '#933dd4',
            justifyContent: 'space-around',
          }}
        />
        <ScrollView>
          <View style={mainStyles.container}>
            <Card title="Settings">
              <ListItem
                title="Logout"
                leftAvatar={
                  <Icon
                    name="sign-out"
                    type="font-awesome"
                    color={variables.mainThemeColor}
                    size={30}
                  />
                }
                chevron
                bottomDivider
                onPress={this.props.logoutFetch.bind(
                  null,
                  this.props.auth.authToken,
                )}
              />
            </Card>
          </View>
        </ScrollView>
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
)(SettingScreen);
