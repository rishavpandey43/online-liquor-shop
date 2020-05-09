// * Import required modules/dependencies
import * as actionTypes from '../actions/types/actionTypes';

const initialState = {
  fetchingOrders: false,
  orders: [],
  errMessage: null,
};

const orders = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_ORDER_REQUEST:
      return {
        ...state,
        fetchingOrders: true,
      };
    case actionTypes.GET_ORDER_SUCCESS:
      return {
        ...state,
        fetchingOrders: false,
        orders: action.orders,
        errMessage: '',
      };
    case actionTypes.GET_ORDER_FAILURE:
      return {
        ...state,
        fetchingOrders: false,
        errMessage: action.message,
      };
    default:
      return {
        ...state,
      };
  }
};

export default orders;
