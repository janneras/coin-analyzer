import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import coinDataReducer from './reducers/coinDataReducer';

const reducer = combineReducers({
  coinData: coinDataReducer,
});

export const store = createStore(reducer, applyMiddleware(thunk));

export default store;
