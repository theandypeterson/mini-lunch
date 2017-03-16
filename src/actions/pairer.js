import { sample } from 'lodash';
import {
  SET_PAIR
} from '../constants';

export function pickPair() {
  const pair = getPair();
  return {
    type: SET_PAIR,
    payload: pair,
  };
}

const getPair = () => sample(['Andy', 'Rachael', 'Dan', 'Alex']);
