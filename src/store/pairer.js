import { pickPair, getAllAtoms } from '../api/pair';
const fetch = require('isomorphic-fetch');
// ------------------------------------
// Constants
// ------------------------------------
export const RANDOM = 'RANDOM';
export const LOAD_ATOMS = 'LOAD_ATOMS';
export const UPDATE_USER = 'UPDATE_USER';
// ------------------------------------
// Actions
// ------------------------------------

export function pickAtom(name) {
    return {
        type: RANDOM,
        payload: name
    }
}

export function loadAtoms(listOfAtoms) {
  listOfAtoms.sort(function (a, b) {
    const lastNameA = a.name.split(' ')[1].toLowerCase();
    const lastNameB = b.name.split(' ')[1].toLowerCase();
    var result = 0;

    if (lastNameA < lastNameB) { result = -1 }
    if (lastNameA > lastNameB) { result = 1 }
    return result
  });

  return {
    type: LOAD_ATOMS,
    payload: listOfAtoms
  }
};

export const fetchAtoms = (isOpen) => {
  return (dispatch) => {
    return new Promise((resolve) => {
      if (isOpen) {
        getAllAtoms().then(result => {
          dispatch(loadAtoms(result));
          resolve();
        });
      }
    });
  };
};

export const fetchAtom = () => {
  return (dispatch, getState) => {
    const state = getState();
    return new Promise((resolve) => {
      pickPair(state.pairer.selectedUser.user_id).then(result => {
        dispatch(pickAtom(result.pair));
        resolve();
      });
    });
  };
};

export function updateUser(eventKey) {
    console.log("Event key is", eventKey);
     return {
        type: UPDATE_USER,
        payload: eventKey
     };
};
export const actions = {
    pickAtom,
    fetchAtom,
    fetchAtoms,
    loadAtoms,
    updateUser
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
    [RANDOM]: (state, action) => {
        return {
            pair: action.payload,
            atomList: state.atomList,
            selectedUser: state.selectedUser
        };
    },
    [LOAD_ATOMS]: (state, action) => {
        return {
            atomList: action.payload,
            pair: state.pair,
            selectedUser: state.selectedUser
        };
    },
    [UPDATE_USER]: (state, action) => {
        const id = action.payload;
        const atom = state.atomList.filter((a) => a.user_id === id)[0];
        return {
            selectedUser: atom,
            pair: state.pair,
            pairButtonDisabled: false
        };
    }
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
