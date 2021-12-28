import coingeckoService from '../services/coingeckoService';

/**
 * Initial state used by the app.
 * It is formatted same as coingecko api returns its data.
 */
const initialState = {
  prices: [],
  market_caps: [],
  total_volumes: [],
  startTime: 0,
  endTime: 0,
};

/**
 * Modify coinData state based on action.
 * @param {Object} state coinData state
 * @param {Object} action coinData dispatch action
 * @returns coinData state
 */
const coinDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'COIN_GETRANGE':
      return action.data;
    case 'COIN_GETRANGEDAYS':
      return action.data;
    default:
      return state;
  }
};

/**
 * Dispatch coinData state with whatever granularity coingecko api gives.
 * @param {*} startTime Unix timestamp of start.
 * @param {*} endTime Unix timestamp of the end.
 * @returns Dispatch COIN_GETRANGE
 */
export const getRange = (startTime, endTime, coin = '', currency = '') => {
  return async (dispatch) => {
    const coinData = await coingeckoService.getRange(
      startTime,
      endTime,
      coin,
      currency
    );
    dispatch({
      type: 'COIN_GETRANGE',
      data: { ...coinData, startTime, endTime },
    });
  };
};

/**
 * Dispatch coinData state with daily granularity coingecko api gives.
 * @param {*} startTime Unix timestamp of start.
 * @param {*} endTime Unix timestamp of the end.
 * @returns Dispatch COIN_GETRANGEDAYS
 */
export const getRangeDays = (startTime, endTime, coin, currency) => {
  return async (dispatch) => {
    const coinData = await coingeckoService.getRangeDays(
      startTime,
      endTime,
      coin,
      currency
    );
    dispatch({
      type: 'COIN_GETRANGEDAYS',
      data: { ...coinData, startTime, endTime },
    });
  };
};

export default coinDataReducer;
