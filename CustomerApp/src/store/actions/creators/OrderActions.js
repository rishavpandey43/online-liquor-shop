// * Import required modules/dependencies
import axios from 'axios';

// * Import all store related stuffs
import * as actionTypes from '../types/actionTypes';

// * Import utilites
import {baseUrl} from '../../../utils/constant';

export const getOrdersRequest = () => {
  return {
    type: actionTypes.GET_ORDER_REQUEST,
  };
};

export const getOrdersSuccess = response => {
  return {
    type: actionTypes.GET_ORDER_SUCCESS,
    orders: response.orders,
    message: response.message,
  };
};

export const getOrdersFailure = response => {
  return {
    type: actionTypes.GET_ORDER_FAILURE,
    message: response.message,
  };
};

export const getOrdersFetch = token => dispatch => {
  dispatch(getOrdersRequest());
  axios
    .get(baseUrl + '/order/get-all-orders-customer', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    .then(res => {
      dispatch(getOrdersSuccess({orders: [...res.data.orders]}));
    })
    .catch(err => {
      console.log(err);
      dispatch(
        getOrdersFailure({
          message: err.response
            ? err.response.data.errMessage || 'Internal Server Error'
            : 'Internal Server Error',
        }),
      );
    });
};

export const placeOrderRequest = () => {
  return {
    type: actionTypes.PLACE_ORDER_REQUEST,
  };
};

export const placeOrderSuccess = response => {
  return {
    type: actionTypes.PLACE_ORDER_SUCCESS,
    orders: response.orders,
    message: response.message,
  };
};

export const placeOrderFailure = response => {
  return {
    type: actionTypes.PLACE_ORDER_FAILURE,
    message: response.message,
  };
};

export const placeOrderFetch = token => dispatch => {
  dispatch(placeOrderRequest());
  axios
    .post(baseUrl + '/order/place-order', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    .then(res => {
      dispatch(placeOrderSuccess({orders: {...res.data.order}}));
    })
    .catch(err => {
      dispatch(
        placeOrderFailure({
          message: err.response
            ? err.response.data.errMessage || 'Internal Server Error'
            : 'Internal Server Error',
        }),
      );
    });
};
