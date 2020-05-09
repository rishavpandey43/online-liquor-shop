// * Import required modules/dependencies
import * as actionTypes from '../actions/types/actionTypes';

const initialState = {
  fetchingProduct: false,
  products: [],
  successMessage: null,
  errMessage: null,
};

const products = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_PRODUCTS_REQUEST:
      return {
        ...state,
        fetchingProduct: true,
      };
    case actionTypes.GET_PRODUCTS_SUCCESS:
      return {
        ...state,
        fetchingProduct: false,
        products: action.products,
        errMessage: '',
      };
    case actionTypes.GET_PRODUCTS_FAILURE:
      return {
        ...state,
        fetchingProduct: false,
        products: null,
        errMessage: action.message,
      };
    default:
      return {
        ...state,
      };
  }
};

export default products;
