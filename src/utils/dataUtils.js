/**
 * Filters out all other datapoints except the ones closes to 00:00:00 UTC
 * @param {Object} {prices, market_caps, total_volumes}-object from
 *                 coingecko api.
 * @returns Datapoints at 00:00:00 UTC
 */
export const filterDays = ({ prices, market_caps, total_volumes }) => {
  const granularity = getGranularity(prices);
  if (granularity == 1) return { prices, market_caps, total_volumes };

  const newArrayLength = Math.floor(prices.length / granularity);

  return {
    prices: [
      ...Array(newArrayLength).map(({}, index) => prices[index * granularity]),
    ],
    market_caps: [
      ...Array(newArrayLength).map(({}, index) => market_caps[index * granularity]),
    ],
    total_volumes: [
      ...Array(newArrayLength).map(({}, index) => total_volumes[index * granularity]),
    ],
  };
};

/**
 * Returns how many data points are between the daily data points.
 * @param {Object} prices {[Timestamps], [Prices]}-object from coingecko api.
 * @returns Interval value used to determine which points corresponds to daily
 *          datapoints at 00:00:00 UTC
 */
const getGranularity = ({ prices }) => {
  if (prices.length < 2) return 1;
  // Calculate the time difference between data points so we only calculate trend for days.
  const timeDiff = Math.floor((prices[1][0] - prices[0][0]) * 0.001);
  if (timeDiff < 6000) {
    if (timeDiff < 1500) {
      return 288;
    }
    return 24;
  }
  return 1;
};
