import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {
  ScrollView,
  StyleSheet,
  View,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {
  Header,
  Card,
  ListItem,
  Button,
  Text,
  Icon,
} from 'react-native-elements';
import RNPickerSelect from 'react-native-picker-select';

// * Import all store related stuffs
import * as OrderActions from '../../store/actions/creators/OrdersActions';

import OrderCard from '../../components/OrderCard';

import {orderStatus} from '../../utils/constant';

import variables from '../../styles/variables';
import mainStyles from '../../styles/mainStyle';

import * as helper from '../../utils/helper';

class OrdersScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredOrders: [],
      selectedStatus: 'all',
    };
  }

  componentDidMount() {
    this.props.getOrdersFetch(this.props.auth.authToken);
    this.setState({filteredOrders: this.props.orders.orders});
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.orders.orders &&
      prevProps.orders.orders.length !== this.props.orders.orders.length
    ) {
      this.setState({filteredOrders: this.props.orders.orders});
    }
    if (
      prevProps.orders.orders &&
      prevProps.orders.orders.length === this.props.orders.orders.length
    ) {
      for (let i = 0; i < prevProps.orders.orders.length; i++) {
        if (
          prevProps.orders.orders[i].status !==
          this.props.orders.orders[i].status
        ) {
          this.setState({filteredOrders: this.props.orders.orders});
        }
      }
    }
  }

  _filterByStatus = status => {
    if (status === 'all') {
      this.setState({filteredOrders: this.props.orders.orders});
    } else {
      this.setState({
        filteredOrders: this.props.orders.orders.filter(
          order => order.status === status,
        ),
      });
    }
  };

  renderOrderList = ({item, index}) => {
    return (
      <View>
        <ListItem
          key={index}
          title={helper.obtainItemsInString(item.items)}
          subtitle={`Status- ${item.status}`}
          chevron
          onPress={() =>
            this.props.navigation.navigate('order-detail-screen', {
              orderId: item._id,
            })
          }>
          <Text />
        </ListItem>
      </View>
    );
  };

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
            text: 'Your Orders',
            style: {color: '#fff'},
          }}
          rightComponent={
            <Icon
              name="product-hunt"
              type="font-awesome"
              color="#FFF"
              underlayColor="transparent"
              size={30}
            />
          }
          containerStyle={{
            backgroundColor: '#933dd4',
            justifyContent: 'space-around',
          }}
        />
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={false}
              colors={[variables.mainThemeColor]}
              onRefresh={() => {
                this.props.getOrdersFetch(this.props.auth.authToken);
              }}
            />
          }>
          {this.props.orders.fetchingOrders ? (
            <View
              style={{
                marginTop: 50,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ActivityIndicator size="large" />
            </View>
          ) : this.props.orders.errMessage || !this.props.orders.orders ? (
            <Card title="Error Message" containerStyle={{alignItems: 'center'}}>
              <Text style={{marginBottom: 20, fontSize: 20, color: 'red'}}>
                {this.props.orders.errMessage || 'Internal Server Error'}
              </Text>
              <Button
                title="Retry"
                type="outline"
                titleStyle={{color: variables.mainThemeColor}}
                buttonStyle={mainStyles.outlineBtn}
                onPress={() => {
                  this.props.getOrdersFetch(this.props.auth.authToken);
                }}
              />
            </Card>
          ) : (
            <View style={[mainStyles.container, {marginBottom: 100}]}>
              <View style={mainStyles.formGroup}>
                <Text style={mainStyles.formLabel}>
                  Filter by order status:
                </Text>
                <View>
                  <RNPickerSelect
                    value={this.state.selectedStatus}
                    onValueChange={(itemValue, itemIndex) => {
                      this.setState({selectedStatus: itemValue});
                      this._filterByStatus(itemValue);
                    }}
                    items={orderStatus}
                    placeholder={{}}
                  />
                </View>
              </View>
              {this.state.filteredOrders &&
              this.state.filteredOrders.length === 0 ? (
                <Text style={{padding: 10, fontSize: 18}}>
                  You don't have any orders of selected category for now. Try to
                  change your category or try again later.
                </Text>
              ) : null}
              {this.state.filteredOrders.map(order => (
                <OrderCard
                  key={order._id}
                  order={order}
                  navigation={this.props.navigation}
                />
              ))}
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
    orders: state.orders,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({...OrderActions}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OrdersScreen);
