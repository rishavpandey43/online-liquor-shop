// * Import required modules/dependencies
import * as actionTypes from '../actions/types/actionTypes';

const initialState = {
  fetchingOrders: false,
  updatingOrder_can: false,
  updatingOrder_other: false,
  orders: [],
  errMessage: null,
};

const orders = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_ORDERS_REQUEST:
      return {
        ...state,
        fetchingOrders: true,
      };
    case actionTypes.GET_ORDERS_SUCCESS:
      return {
        ...state,
        fetchingOrders: false,
        orders: action.orders,
        errMessage: null,
      };
    case actionTypes.GET_ORDERS_FAILURE:
      return {
        ...state,
        fetchingOrders: false,
        orders: null,
        errMessage: action.message,
      };
    case actionTypes.PROCESS_ORDER_REQUEST:
      return {
        ...state,
        [action.loadingType]: true,
      };
    case actionTypes.PROCESS_ORDER_SUCCESS:
      return {
        ...state,
        [action.loadingType]: false,
      };
    case actionTypes.PROCESS_ORDER_FAILURE:
      return {
        ...state,
        [action.loadingType]: false,
      };
    default:
      return {
        ...state,
      };
  }
};

export default orders;
