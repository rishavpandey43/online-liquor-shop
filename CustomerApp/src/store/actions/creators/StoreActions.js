// * Import required modules/dependencies

// * Import all store related stuffs
import * as actionTypes from '../types/actionTypes';

// * Import utilites

export const selectStore = store => {
  return {
    type: actionTypes.SELECT_STORE,
    store: {...store},
  };
};
