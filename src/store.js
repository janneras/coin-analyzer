import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import coinDataReducer from './reducers/coinDataReducer';
import coinInfoReducer from './reducers/coinInfoReducer';

const reducer = combineReducers({
  coinData: coinDataReducer,
  coinInfo: coinInfoReducer,
});

export const store = createStore(reducer, applyMiddleware(thunk));

export default store;
