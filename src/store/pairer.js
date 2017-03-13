import {
  PICK_PAIR
} from '../constants';
// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
    [PICK_PAIR]: (state, action) => {
        return {
            pair: 'something',
            atomList: state.atomList,
            selectedUser: state.selectedUser
        };
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
