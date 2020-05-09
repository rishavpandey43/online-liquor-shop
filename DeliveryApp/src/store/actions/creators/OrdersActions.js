// * Import required modules/dependencies
import axios from 'axios';
import {ToastAndroid} from 'react-native';

// * Import all store related stuffs
import * as actionTypes from '../types/actionTypes';

// * Import utilites
import {baseUrl} from '../../../utils/constant';

export const getOrdersRequest = () => {
  return {
    type: actionTypes.GET_ORDERS_REQUEST,
  };
};

export const getOrdersSuccess = response => {
  return {
    type: actionTypes.GET_ORDERS_SUCCESS,
    orders: response.orders,
    message: response.message,
  };
};

export const getOrdersFailure = response => {
  return {
    type: actionTypes.GET_ORDERS_FAILURE,
    message: response.message,
  };
};

export const getOrdersFetch = token => dispatch => {
  dispatch(getOrdersRequest());
  axios
    .get(baseUrl + '/order/get-all-orders-deliveryAgent', {
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

export const processOrderRequest = loadingType => {
  return {
    type: actionTypes.PROCESS_ORDER_REQUEST,
    loadingType,
  };
};

export const processOrderSuccess = loadingType => {
  return {
    type: actionTypes.PROCESS_ORDER_SUCCESS,
    loadingType,
  };
};

export const processOrderFailure = loadingType => {
  return {
    type: actionTypes.PROCESS_ORDER_FAILURE,
    loadingType,
  };
};

export const processOrderFetch = (token, processType, orderId) => dispatch => {
  dispatch(
    processOrderRequest(
      processType === 'can' ? 'updatingOrder_can' : 'updatingOrder_other',
    ),
  );
  axios
    .put(
      baseUrl + '/order/process-order-deliveryAgent',
      {processType, orderId},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )
    .then(res => {
      dispatch(
        processOrderSuccess(
          processType === 'can' ? 'updatingOrder_can' : 'updatingOrder_other',
        ),
      );
      dispatch(getOrdersFetch(token));
      ToastAndroid.show(
        'This order has been processed succcessfully.',
        ToastAndroid.LONG,
      );
    })
    .catch(err => {
      console.log(err.response);
      dispatch(
        processOrderFailure(
          processType === 'can' ? 'updatingOrder_can' : 'updatingOrder_other',
        ),
      );
      ToastAndroid.show(
        err.response
          ? err.response.status != 500
            ? err.response.data.errMessage
            : "This order can't be processed right now, please try again."
          : "This order can't be processed right now, please try again.",
        ToastAndroid.LONG,
      );
    });
};
