// Coingeckos public api
const baseUrl = 'https://api.coingecko.com/api/v3';
const defaultCoin = 'bitcoin';
const defaultCurrency = 'eur';

// Data with hourly granularity.
const localHourly = require('../data/bitcoin_eur_2020_01_19-2020_01_21.json');
// Data with daily granularity.
const localDaily = require('../data/bitcoin_eur_2020_03_01-2021_08_01.json');
// Data with 5min granularity.
const local5min = require('../data/bitcoin_eur_2021_12_16-2021_12_17.json');

/**
 * Get prices, market_caps and trading_volumes as given currency for given coin from startTime to Endtime.
 * Response is automatically granulated based on length of the query (endTime - startTime).
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
  coin = defaultCoin,
  currency = defaultCurrency
) => {
  // Add hour to end timestamp to make sure we get end dates values at 00:00:00 UTC.
  const endTimeAddHour = Number(endTime) + 3600;
  const response = await fetch(
    `${baseUrl}/coins/${coin}/market_chart/range?vs_currency=${currency}&from=${startTime}&to=${endTimeAddHour}`,
    { method: 'GET' }
  );
  return response.json();
};

/**
 * Get local testing data for hourly granulation.
 * @returns localHourly
 */
const getLocalHourly = () => {
  return localHourly;
};

/**
 * Get local testing data for daily granularity.
 * @returns localDaily
 */
const getLocalDaily = () => {
  return localDaily;
};

/**
 * Get local testing data for 5 minute granularity.
 * @returns local5min
 */
const getLocal5min = () => {
  return local5min;
};

const exports = { getRange, getLocalHourly, getLocalDaily, getLocal5min };

export default exports;
