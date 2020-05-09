// * Import required modules/dependencies
import axios from 'axios';

// * Import all store related stuffs
import * as actionTypes from '../types/actionTypes';

// * Import utilites
import {baseUrl} from '../../../utils/constant';

export const getProductsRequest = () => {
  return {
    type: actionTypes.GET_PRODUCTS_REQUEST,
  };
};

export const getProductsSuccess = response => {
  return {
    type: actionTypes.GET_PRODUCTS_SUCCESS,
    products: response.products,
    message: response.message,
  };
};

export const getProductsFailure = response => {
  return {
    type: actionTypes.GET_PRODUCTS_FAILURE,
    message: response.message,
  };
};

export const getProductsFetch = token => dispatch => {
  dispatch(getProductsRequest());
  axios
    .get(baseUrl + '/seller/get-all-products', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    .then(res => {
      dispatch(getProductsSuccess({products: res.data.products}));
    })
    .catch(err => {
      console.log(err);
      dispatch(
        getProductsFailure({
          message: err.response
            ? err.response.data.errMessage || 'Internal Server Error'
            : 'Internal Server Error',
        }),
      );
    });
};
