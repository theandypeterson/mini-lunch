import { combineReducers } from 'redux';
import locationReducer from './location';
import pairerReducer from './pairer';

export const makeRootReducer = () => {
  return combineReducers({
    location: locationReducer,
    pairer: pairerReducer,
  })
};

export default makeRootReducer;
