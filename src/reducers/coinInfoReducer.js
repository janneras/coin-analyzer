import coingeckoService from '../services/coingeckoService';
const DEFAULT_COIN = 'bitcoin';

/**
 * Initial state used by the app.
 */
const initialState = {
  id: 'bitcoin',
  name: 'Bitcoin',
  symbol: 'btc',
  image: {
    thumb:
      'https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png?1547033579',
    small:
      'https://assets.coingecko.com/coins/images/1/small/bitcoin.png?1547033579',
    large:
      'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579',
  },
  current_price: 0,
  currency: 'eur',
};

/**
 * Modify coinInfo state based on action.
 * @param {Object} state coinInfo state
 * @param {Object} action coinInfo dispatch action
 * @returns coinInfo state
 */
const coinInfoReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'INFO_GETINFO':
      const newState = {
        ...action.data,
        current_price: action.data.current_price[state.currency],
        currency: state.currency,
      };
      return newState;
    case 'INFO_SETCURRENCY':
      return { ...state, currency: action.data.currency };
    default:
      return state;
  }
};

/**
 * Get info on the coin and dispatch it
 * @param {String} coinID id of coin to fetch
 * @returns Dispatch INFO_GETINFO
 */
export const getInfo = (coinID = DEFAULT_COIN) => {
  return async (dispatch) => {
    const info = await coingeckoService.getCoinInfo(coinID);
    dispatch({
      type: 'INFO_GETINFO',
      data: {
        id: info.id,
        name: info.name,
        symbol: info.symbol,
        image: info.image,
        current_price: info.market_data.current_price,
      },
    });
  };
};

/**
 * Change used currency.
 * @param {String} currency Currency shortname
 * @returns Dispatch INFO_SETCURRENCY
 */
export const changeCurrency = (currency) => {
  return {
    type: 'INFO_SETCURRENCY',
    data: { currency },
  };
};

export default coinInfoReducer;
