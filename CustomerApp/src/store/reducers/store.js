// * Import required modules/dependencies
import * as actionTypes from '../actions/types/actionTypes';

const initialState = {
  store: null,
};

const store = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SELECT_STORE:
      return {
        ...state,
        store: action.store,
      };
    default:
      return {
        ...state,
      };
  }
};

export default store;
