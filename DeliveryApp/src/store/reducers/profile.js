// * Import required modules/dependencies
import * as actionTypes from '../actions/types/actionTypes';

const initialState = {
  fetchingProfile: false,
  profileUpdating: false,
  profile: null,
  successMessage: null,
  errMessage: null,
};

const profile = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_PROFILE_REQUEST:
      return {
        ...state,
        fetchingProfile: true,
      };
    case actionTypes.GET_PROFILE_SUCCESS:
      return {
        ...state,
        fetchingProfile: false,
        profile: action.profile,
        errMessage: '',
      };
    case actionTypes.GET_PROFILE_FAILURE:
      return {
        ...state,
        fetchingProfile: false,
        errMessage: action.message,
      };
    case actionTypes.UPDATE_PROFILE_REQUEST:
      return {
        ...state,
        profileUpdating: true,
      };
    case actionTypes.UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        profileUpdating: false,
        profile: action.profile,
        errMessage: '',
      };
    case actionTypes.UPDATE_PROFILE_FAILURE:
      return {
        ...state,
        profileUpdating: false,
        errMessage: action.message,
      };
    default:
      return {
        ...state,
      };
  }
};

export default profile;
