/**
 * Filters out all other datapoints except the ones closes to 00:00:00 UTC
 * @param {Object} CoinData {prices, market_caps, total_volumes}-object from
 *                 coingecko api.
 * @returns Datapoints at 00:00:00 UTC
 */
export const filterDays = ({ prices, market_caps, total_volumes }) => {
  if (!prices && !market_caps && !total_volumes)
    return { prices: [], market_caps: [], total_volumes: [] };
  // Check if the data is daily, hourly or 5 minutes apart.
  const granularity = getGranularity(prices);

  // If it's daily data, it's always in correct form.
  if (granularity === 1) return { prices, market_caps, total_volumes };

  // Time to compare to. First timestamp set to 00:00:00UTC on the next day.
  let compareTime = prices[0][0] - (prices[0][0] % 86400000) + 86400000;
  const returnObject = {
    prices: [prices[0]],
    market_caps: [market_caps[0]],
    total_volumes: [total_volumes[0]],
  };
  let diff,
    prevDiff = compareTime;

  // Find datapoints closests to compareTime
  for (let i = 1; i < prices.length; i++) {
    diff = Math.abs(prices[i][0] - compareTime);
    if (diff < prevDiff) {
      prevDiff = diff;
      continue;
    } else {
      compareTime += 86400000;
      prevDiff = Math.abs(prices[i][0] - compareTime);

      // All timestamps are the same for each datagroup.
      returnObject.total_volumes.push(total_volumes[i - 1]);
      returnObject.market_caps.push(market_caps[i - 1]);
      returnObject.prices.push(prices[i - 1]);

      // Skip ahead 9 items to speed the loop up.
      // Don't go too fast though,
      // Sometimes there are only 12 hours in a day apparently.
      i += 9;
    }
  }

  // If data is at 5 minute granularity. Check if the last datapoint is
  // correct.
  if (granularity === 288) {
    const lastDate = new Date(prices[prices.length - 1][0]);
    if (lastDate.getUTCHours() !== 0 || lastDate.getUTCMinutes() > 8)
      return returnObject;
  }

  // Add final datapoint to filtered data. It's always correct for
  // hourly data.
  returnObject.total_volumes.push(total_volumes[total_volumes.length - 1]);
  returnObject.market_caps.push(market_caps[market_caps.length - 1]);
  returnObject.prices.push(prices[prices.length - 1]);

  return returnObject;
};

/**
 * Returns how many data points are between the daily data points.
 * @param {Object} timestampValuePair {[Timestamps], [Prices]}-object from coingecko api.
 * @returns Interval value used to determine which points corresponds to daily
 *          datapoints at 00:00:00 UTC
 */
const getGranularity = (timestampValuePair) => {
  if (!timestampValuePair || timestampValuePair.length < 2) return 1;
  // Calculate the time difference between data points so we only calculate trend for days.
  const timeDiff = Math.floor(
    (timestampValuePair[1][0] - timestampValuePair[0][0]) * 0.001
  );
  // Less than 10 hours.
  if (timeDiff < 36000) {
    // Less than 12 minutes
    if (timeDiff < 720) {
      return 288;
    }
    return 24;
  }
  return 1;
};

export const longestDownwardTrend = (timeValuePairs) => {
  if (!timeValuePairs) return { start: '', end: '', length: 0 };
  let n = 0;
  let start = timeValuePairs[0];

  let longest = {
    start: '',
    end: '',
    length: 0,
  };

  for (let i = 1; i < timeValuePairs.length; i++) {
    if (timeValuePairs[i][1] < timeValuePairs[i - 1][1]) {
      n++;
      if (n > longest.length) {
        longest.start = start;
        longest.end = timeValuePairs[i];
        longest.length = n;
      }
    } else {
      n = 0;
      start = timeValuePairs[i];
    }
  }

  return longest;
};
