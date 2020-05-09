// * Import required modules/dependencies
import * as actionTypes from '../actions/types/actionTypes';

const initialState = {
  isAuthenticated: false,
  authToken: null,
  fcmToken: null,
  isLoading: false,
  errMessage: null,
};

const auth = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_TOKEN:
      return {
        ...state,
        isAuthenticated: action.token ? true : false,
        authToken: action.token,
      };
    case actionTypes.LOGIN_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case actionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        authToken: action.token,
        errMessage: null,
      };
    case actionTypes.LOGIN_FAILURE:
      return {
        ...state,
        isLoading: false,
        errMessage: action.errMessage,
      };
    case actionTypes.LOGOUT_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case actionTypes.LOGOUT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        authToken: false,
        errMessage: null,
      };
    case actionTypes.LOGOUT_FAILURE:
      return {
        ...state,
        isLoading: false,
      };
    default:
      return {
        ...state,
      };
  }
};

export default auth;
