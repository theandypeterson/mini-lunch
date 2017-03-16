import {
  SET_PAIR,
  SET_USER,
  SET_ATOM_LIST,
} from '../constants';

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SET_PAIR]: (state, action) => {
    const { payload: pair } = action
    return Object.assign({}, state, { pair });
  },
  [SET_USER]: (state, action) => {
    const { payload: selectedUser } = action;
    return Object.assign({}, state, { selectedUser });
  },
  [SET_ATOM_LIST]: (state, action) => {
    const { payload: atomList } = action;
    return Object.assign({}, state, { atomList });
  },
};

// ------------------------------------
// Reducer
// ------------------------------------
export const initialState = {
  selectedUser: {id: -1, name: "Please select your name"},
  pair: '',
  atomList: [{id: -1, name: 'No Results'}],
  pairButtonDisabled: true
};

export default function randomReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}
