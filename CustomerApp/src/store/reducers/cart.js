// * Import required modules/dependencies
import * as actionTypes from '../actions/types/actionTypes';

const initialState = {
  fetchingCart: false,
  cart: {storeId: null, products: [], deliveryCharge: null},
  errMessage: null,
};

const store = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_CART_DETAIL_REQUEST:
      return {
        ...state,
        fetchingCart: true,
      };
    case actionTypes.GET_CART_DETAIL_SUCCESS:
      return {
        ...state,
        cart: {
          storeId: action.storeId,
          products: action.products,
          deliveryCharge: action.deliveryCharge,
        },
        errMessage: null,
        fetchingCart: false,
      };
    case actionTypes.GET_CART_DETAIL_FAILURE:
      return {
        ...state,
        cart: null,
        fetchingCart: false,
        errMessage: action.message,
      };
    case actionTypes.UPDATE_CART_TO_SERVER_REQUEST:
      return {
        ...state,
        updatingCart: true,
      };
    case actionTypes.UPDATE_CART_TO_SERVER_SUCCESS:
      return {
        ...state,
        updatingCart: false,
        cart: {
          storeId: action.storeId,
          products: action.products,
          deliveryCharge: action.deliveryCharge,
        },
      };
    case actionTypes.UPDATE_CART_TO_SERVER_FAILURE:
      return {
        ...state,
        updatingCart: false,
      };
    case actionTypes.ADD_NEW_PRODUCT_TO_CART:
      return {
        ...state,
        cart: {
          storeId: action.storeId,
          products: action.products,
          deliveryCharge: action.deliveryCharge,
        },
      };
    case actionTypes.CHANGE_PRODUCT_QUANTITY_IN_CART:
      return {
        ...state,
        cart: {
          storeId: action.storeId,
          products: action.products,
          deliveryCharge: action.deliveryCharge,
        },
      };
    default:
      return {
        ...state,
      };
  }
};

export default store;
