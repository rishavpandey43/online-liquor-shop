// * Import required modules/dependencies
import axios from 'axios';
import {ToastAndroid} from 'react-native';

// * Import all store related stuffs
import * as actionTypes from '../types/actionTypes';

// * Import utilites
import {storeDataInAsync, getDataFromAsync} from '../../../utils/helper';
import {baseUrl} from '../../../utils/constant';

export const addNewProductToCart = ({storeId, products, deliveryCharge}) => {
  return {
    type: actionTypes.ADD_NEW_PRODUCT_TO_CART,
    storeId,
    products,
    deliveryCharge,
  };
};

export const changeProductQuantityinCart = ({
  storeId,
  products,
  deliveryCharge,
}) => {
  return {
    type: actionTypes.CHANGE_PRODUCT_QUANTITY_IN_CART,
    storeId,
    products,
    deliveryCharge,
  };
};

export const getCartDetailRequest = () => {
  return {
    type: actionTypes.GET_CART_DETAIL_REQUEST,
  };
};

export const getCartDetailSuccess = ({storeId, products, deliveryCharge}) => {
  return {
    type: actionTypes.GET_CART_DETAIL_SUCCESS,
    storeId,
    products,
    deliveryCharge,
  };
};

export const getCartDetailFailure = response => {
  return {
    type: actionTypes.GET_CART_DETAIL_FAILURE,
    message: response.message,
  };
};

export const getCartDetailFetch = token => dispatch => {
  dispatch(getCartDetailRequest());
  axios
    .get(baseUrl + '/customer/get-cart', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    .then(res => {
      dispatch(getCartDetailSuccess(res.data.cart));
    })
    .catch(err => {
      dispatch(
        getCartDetailFailure({
          message: err.response
            ? err.response.data.errMessage || 'Internal Server Error'
            : 'Internal Server Error',
        }),
      );
    });
};

export const updateCartToAsyncStorageRequest = () => {
  return {
    type: actionTypes.UPDATE_CART_TO_ASYNC_STORAGE_REQUEST,
  };
};

export const updateCartToAsyncStorageSuccess = () => {
  return {
    type: actionTypes.UPDATE_CART_TO_ASYNC_STORAGE_SUCCESS,
  };
};

export const updateCartToAsyncStorageFailure = () => {
  return {
    type: actionTypes.UPDATE_CART_TO_ASYNC_STORAGE_FAILURE,
  };
};

export const updateCartToAsyncStorageFetch = (type, cart) => dispatch => {
  dispatch(updateCartToAsyncStorageRequest());
  storeDataInAsync('eMadhushala_customer_cart', JSON.stringify(cart))
    .then(response => {
      getDataFromAsync('eMadhushala_customer_cart')
        .then(updatedCart => {
          dispatch(updateCartToAsyncStorageSuccess());
          if (type == 'new') {
            dispatch(addNewProductToCart(JSON.parse(updatedCart)));
            ToastAndroid.show('Product added to cart', ToastAndroid.SHORT);
          } else if (type == 'increment' || type == 'decrement') {
            dispatch(changeProductQuantityinCart(JSON.parse(updatedCart)));
            ToastAndroid.show(
              'Product quantity updated in cart',
              ToastAndroid.SHORT,
            );
          }
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      dispatch(updateCartToServerFailure);
      ToastAndroid.show(
        "Sorry, product can't be added to cart, try again.",
        ToastAndroid.LONG,
      );
    });
};

export const updateCartToServerRequest = () => {
  return {
    type: actionTypes.UPDATE_CART_TO_SERVER_REQUEST,
  };
};

export const updateCartToServerSuccess = ({
  storeId,
  products,
  deliveryCharge,
}) => {
  return {
    type: actionTypes.UPDATE_CART_TO_SERVER_SUCCESS,
    storeId,
    products,
    deliveryCharge,
  };
};

export const updateCartToServerFailure = () => {
  return {
    type: actionTypes.UPDATE_CART_TO_SERVER_FAILURE,
  };
};

export const updateCartToServerFetch = token => dispatch => {
  dispatch(updateCartToServerRequest());
  getDataFromAsync('eMadhushala_customer_cart')
    .then(cart => {
      axios
        .put(baseUrl + '/customer/update-cart', cart, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        .then(res => {
          storeDataInAsync(
            'eMadhushala_customer_cart',
            JSON.stringify(res.data.newCart),
          )
            .then(response => {
              getDataFromAsync('eMadhushala_customer_cart')
                .then(updatedCart => {
                  dispatch(updateCartToServerSuccess(JSON.parse(updatedCart)));
                })
                .catch(err => {
                  console.log(err);
                });
            })
            .catch(err => {
              dispatch(updateCartToServerFailure);
              ToastAndroid.show(
                "Sorry, product can't be added to cart, try again.",
                ToastAndroid.LONG,
              );
            });
        })
        .catch(err => {
          dispatch(
            updateCartToServerFailure({
              message: err.response
                ? err.response.data.errMessage || 'Internal Server Error'
                : 'Internal Server Error',
            }),
          );
        });
    })
    .catch(err => {
      console.log(err);
    });
};
