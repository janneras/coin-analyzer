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
 * @param {Array} timestampValuePair [[Timestamps, Value]]-Array from coingecko api.
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

/**
 * Find the longest streak of values going down in time-value pairs.
 * @param {Array} timestampValuePair [[Timestamps, Value]]-Array from coingecko api.
 * @returns {Array} Start and end of the streak and the length of that streak.
 */
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

/**
 * Find highest value among time-value pairs.
 * @param {Array} timestampValuePair [[Timestamps, Value]]-Array from coingecko api.
 * @returns {Array} Highest time-value pair.
 */
export const highest = (timeValuePairs) => {
  if (!timeValuePairs || timeValuePairs.length === 0) return timeValuePairs;
  let highest = timeValuePairs[0];

  for (let i = 1; i < timeValuePairs.length; i++) {
    if (timeValuePairs[i][1] > highest[1]) highest = timeValuePairs[i];
  }

  return highest;
};

/**
 * Find lowest value among time-value pairs.
 * @param {Array} timestampValuePair [[Timestamps, Value]]-Array from coingecko api.
 * @returns {Array} Lowest time-value pair.
 */
export const lowest = (timeValuePairs) => {
  if (!timeValuePairs || timeValuePairs.length === 0) return timeValuePairs;
  let lowest = timeValuePairs[0];

  for (let i = 1; i < timeValuePairs.length; i++) {
    if (timeValuePairs[i][1] < lowest[1]) lowest = timeValuePairs[i];
  }

  return lowest;
};

export const timeToBuySell = (timeValuePairs) => {
  const landScape = peaksAndValleys(timeValuePairs);
};

/**
 * Find all the valleys and peaks in values data.
 * @param {Array} timestampValuePair [[Timestamps, Value]]-Array from coingecko api.
 * @returns Peaks and valleys of prices data.
 */
const peaksAndValleys = (timeValuePairs) => {
  if (!timeValuePairs || timeValuePairs.length < 2)
    return { peaks: [], valleys: [] };

  // Determine the starting direction. False is down, true is up.
  let direction =
    timeValuePairs[1][1] - timeValuePairs[0][1] < 0 ? false : true;
  let newDirection;

  const landscape = { peaks: [], valleys: [] };

  // Add first datapoint as valley or a peak.
  if (direction) {
    landscape.valleys.push(timeValuePairs[0]);
  } else {
    landscape.peaks.push(timeValuePairs[0]);
  }

  /**
   * Go through all datapoints only storing the ones that
   * change direction as valleys and peaks.
   */
  for (let i = 1; i < timeValuePairs.length - 1; i++) {
    newDirection =
      timeValuePairs[i + 1][1] - timeValuePairs[i][1] < 0 ? false : true;

    if (direction !== newDirection) {
      if (direction) {
        landscape.peaks.push(timeValuePairs[i]);
      } else {
        landscape.valleys.push(timeValuePairs[i]);
      }
    } else continue;

    direction = newDirection;
  }

  // Add last datapoint as peak or a valley.
  if (direction) {
    landscape.peaks.push(timeValuePairs[timeValuePairs.length - 1]);
  } else {
    landscape.valleys.push(timeValuePairs[timeValuePairs.length - 1]);
  }

  return landscape;
};
