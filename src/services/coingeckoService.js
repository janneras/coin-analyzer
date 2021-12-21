import { filterDays } from '../utils/dataUtils';

// Coingeckos public api
const BASE_URL = 'https://api.coingecko.com/api/v3';
const DEFAULT_COIN = 'bitcoin';
const DEFAULT_CURRENCY = 'eur';

// Data with hourly granularity.
const localHourly = require('../data/bitcoin_eur_2020_01_19-2020_01_21.json');
// Data with daily granularity.
const localDaily = require('../data/bitcoin_eur_2020_03_01-2021_08_01.json');
// Data with 5min granularity.
const local5min = require('../data/bitcoin_eur_2021_12_16-2021_12_17.json');

/**
 * Get prices, market_caps and trading_volumes as given currency for given coin from
 * startTime to Endtime. Response is automatically granulated based on length of the
 * query (endTime - startTime).
 * < 1 day, 5min granularity.
 * 1-90 days, hourly granularity.
 * > 90 days, daily granularity.
 * @param {String} startTime Unix timestamp for starting time.
 * @param {String} endTime Unix timestamp for ending time.
 * @param {String} coin Cryptocurrency to get. Default 'bitcoin'.
 * @param {String} currency Currency to use. Defautl 'eur'.
 * @returns {Object} {prices, market_caps, trading_volumes} for given coin within timeframe.
 */
const getRange = (
  startTime,
  endTime,
  coin = DEFAULT_COIN,
  currency = DEFAULT_CURRENCY
) => {
  // Add hour to end timestamp to make sure we get end dates values at 00:00:00 UTC.
  const endTimeAddHour = Number(endTime) + 3600;
  const response = await fetch(
    `${BASE_URL}/coins/${coin}/market_chart/range?vs_currency=${currency}&from=${startTime}&to=${endTimeAddHour}`,
    { method: 'GET' }
  );
  return response.json();
};

/**
 * Get prices, market_caps and trading_volumes as given currency for given coin from
 * startTime to Endtime in 1 day granularity.
 * @param {String} startTime Unix timestamp for starting time.
 * @param {String} endTime Unix timestamp for ending time.
 * @param {String} coin Cryptocurrency to get. Default 'bitcoin'.
 * @param {String} currency Currency to use. Defautl 'eur'.
 * @returns {Object} {prices, market_caps, trading_volumes} for given coin within timeframe.
 */
const getRangeDays = (
  startTime,
  endTime,
  coin = DEFAULT_COIN,
  currency = DEFAULT_CURRENCY
) => {
  return filterDays(getRange(startTime, endTime, coin, currency));
};

/**
 * Get local testing data for hourly granulation in days.
 * @returns localHourly
 */
const getLocalHourly = () => {
  return filterDays(localHourly);
};

/**
 * Get local testing data for daily granularity in days.
 * @returns localDaily
 */
const getLocalDaily = () => {
  return filterDays(localDaily);
};

/**
 * Get local testing data for 5 minute granularity in days.
 * @returns local5min
 */
const getLocal5min = () => {
  return filterDays(local5min);
};

const exports = {
  getRange,
  getRangeDays,
  getLocalHourly,
  getLocalDaily,
  getLocal5min,
};

export default exports;
