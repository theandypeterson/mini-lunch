import { clone } from 'lodash';
import { SET_PAIR } from 'constants';
import pairerReducer from 'store/pairer';

describe('(Internal Module) Pairer', () => {
  describe('(Reducer)', () => {
    let initialState;
    beforeEach(() => {
      initialState = pairerReducer(undefined, {});
    });

    it('Should be a function.', () => {
      expect(pairerReducer).to.be.a('function');
    });

    it('Should not alter the initial state', () => {
      pairerReducer(initialState, { type: SET_PAIR, payload: 'Andy'});
      expect(initialState.pair).to.not.equal('Andy');
    });

    it('Should return the previous state if an action was not matched.', () => {
      const nextState = pairerReducer(initialState, { type: '@@@@@@@' });
      expect(nextState).to.equal(initialState);
    });

    it('Should change a selected pair', () => {
      const nextState = pairerReducer(initialState, { type: SET_PAIR, payload: 'Andy' });
      expect(initialState.pair).to.not.equal('Andy');

      expect(nextState.pair).to.equal('Andy');
    });
  });
});
