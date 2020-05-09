// * Import required modules/dependencies
import * as actionTypes from '../actions/types/actionTypes';

const initialState = {
  fetchingSellers: false,
  sellers: [],
  errMessage: null,
};

const sellers = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_SELLERS_REQUEST:
      return {
        ...state,
        fetchingSellers: true,
      };
    case actionTypes.GET_SELLERS_SUCCESS:
      return {
        ...state,
        fetchingSellers: false,
        sellers: action.sellers,
        errMessage: '',
      };
    case actionTypes.GET_SELLERS_FAILURE:
      return {
        ...state,
        fetchingSellers: false,
        errMessage: action.message,
      };
    default:
      return {
        ...state,
      };
  }
};

export default sellers;
