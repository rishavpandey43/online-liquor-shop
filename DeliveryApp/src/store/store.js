// * Import required modules/dependencies
import {createStore, applyMiddleware} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

// * Import all store related stuffs
import rootReducer from './reducers/index';

const middleware = [thunk, logger];

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(...middleware)),
);

export default store;
