// * Import required modules/dependencies
import AsyncStorage from '@react-native-community/async-storage';

import {
  verificationDocumentType,
  categoryList,
  orderStatus,
  paymentMode,
} from './constant';

export const storeDataInAsync = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    // Error retrieving data
    console.log(error.message);
  }
};

export const getDataFromAsync = async key => {
  let value = '';
  try {
    value = (await AsyncStorage.getItem(key)) || null;
    if (value !== null) {
      // value previously stored
      return value;
    }
  } catch (e) {
    // error reading value
  }
};

export const removeDataFromAsync = async key => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    // Error retrieving data
    console.log(error.message);
  }
};

export const filterProductBySeller = (sellerId, products) => {
  products = products.filter(product => product.seller === sellerId);
  return products;
};

export const filterOrderBySeller = (sellerId, orders) => {
  orders = orders.filter(order => order.orderedFrom === sellerId);
  return orders;
};

export const obtainItemsInString = (items, i) => {
  let orderName = ''.concat(
    items.map(item => {
      return item.name;
    }),
  );
  return orderName;
};

export const obtainAddressInString = address => {
  let addressString = '';
  for (const key in address) {
    if (key != 'type') {
      addressString += address[key] + ', ';
    }
  }
  return addressString;
};

export const getVerificationDocumentName = documentValue => {
  return (
    verificationDocumentType.filter(
      document => document.value === documentValue,
    )[0].name || '-'
  );
};

export const getCategoryName = categoryValue => {
  return (
    categoryList.filter(category => category.value === categoryValue)[0].name ||
    '-'
  );
};

export const getOrderStatus = type => {
  return orderStatus.filter(status => status.value === type)[0];
};

export const getpaymentMode = type => {
  return paymentMode.filter(payment => payment.value === type)[0].name;
};

// TODO: complete this function
export const convertToPascalCase = () => {};
