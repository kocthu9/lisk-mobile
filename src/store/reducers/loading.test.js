import loading from './loading';
import actionTypes from '../../constants/actions';


describe('Reducers: Loading', () => {
  let state;

  beforeEach(() => {
    state = ['loading_1', 'loading_2'];
  });

  test('should return loading array with the new loading if action.type = actionTypes.loadingStarted', () => {
    const action = {
      type: actionTypes.loadingStarted,
      data: 'loading_3',
    };
    const changedState = loading(state, action);
    expect(changedState).toEqual([...state, action.data]);
  });

  test('should return loading array without action.data if action.type = actionTypes.loadingFinished', () => {
    const action = {
      type: actionTypes.loadingFinished,
      data: 'loading_1',
    };
    const changedState = loading(state, action);
    expect(changedState).toEqual(['loading_2']);
  });
});

