import {
  filterDays,
  longestDownwardTrend,
  highest,
  lowest,
  timeToBuySell,
} from './dataUtils';

// Data with hourly granularity.
const localHourly = require('../data/bitcoin_eur_2020_01_19-2020_01_21.json');
// Data with daily granularity.
const localDaily = require('../data/bitcoin_eur_2020_03_01-2021_08_01.json');
// Data with 5min granularity.
const local5min = require('../data/bitcoin_eur_2021_12_16-2021_12_17.json');

// More info in data.txt file at ../data/
const local1 = require('../data/bitcoin_eur_2018_03_01-2018_03_08.json');
const local2 = require('../data/bitcoin_eur_2019_03_25-2019_04_01.json');
const local3 = require('../data/bitcoin_eur_2021_01_01-2021_02_28.json');
const local4 = require('../data/bitcoin_eur_2021_05_31-2021_06_28.json');
const local5 = require('../data/bitcoin_eur_2021_12_11-2021_12_13.json');

describe('Data filtering', () => {
  test('Data is empty', () => {
    const output = filterDays({});

    expect(output).toStrictEqual({
      prices: [],
      market_caps: [],
      total_volumes: [],
    });
  });

  test('Daily data is passed back as same', () => {
    const output = filterDays(localDaily);

    expect(output).toStrictEqual(localDaily);
  });

  test('Hourly data constains 3 datapoints. 19th, 20th and 21st', () => {
    const output = filterDays(localHourly);

    const prices = [...output.prices];
    // 2020-01-19 at 00:04:42.472 UTC
    const firstDay = 1579392282472;
    // 2020-01-20 at 00:04:24.166 UTC
    const secondDay = 1579478664166;
    // 2020-01-21 at 00:07:43.674 UTC
    const lastDay = 1579565263674;

    expect(output.prices).toHaveLength(3);
    expect(prices[0][0]).toStrictEqual(firstDay);
    expect(prices[1][0]).toStrictEqual(secondDay);
    expect(prices[2][0]).toStrictEqual(lastDay);
  });

  test('5 minute interval returns 2 data points', () => {
    const output = filterDays(local5min);

    expect(output.prices).toHaveLength(2);
  });

  test('Identify data as daily even though first and last day indicates hourly data', () => {
    const output = filterDays(local1);

    expect(output).toStrictEqual(local1);
  });

  test('Only 16 data points are present in one day', () => {
    const output = filterDays(local2);

    // 2019-03-25 - 2019-04-01 is 8 days
    expect(output.prices).toHaveLength(8);
  });

  test('Closest value to 00:00:00 UTC is over 30 minutes away.', () => {
    const output = filterDays(local3);

    // 59 days
    expect(output.prices).toHaveLength(59);

    // 17th days value is actually closer to 16th 23rd hour.
    // 1610839732333 = 2021-01-16 at 23:28:52.333 UTC
    expect(output.prices[16][0]).toStrictEqual(1610839732333);
  });

  test('First datapoints have 1 hour 50 minutes between them', () => {
    const output = filterDays(local4);

    // 29 days
    expect(output.prices).toHaveLength(29);
  });
});

describe('Downward trend', () => {
  test('Data is empty', () => {
    const output = longestDownwardTrend([]);

    expect(output).toStrictEqual({ start: '', end: '', length: 0 });
  });

  test('Data is undefined', () => {
    const output = longestDownwardTrend();

    expect(output).toStrictEqual({ start: '', end: '', length: 0 });
  });

  test('Expect answer to be 2 from localHourly when filtered', () => {
    const output = longestDownwardTrend(filterDays(localHourly).prices);

    expect(output.length).toStrictEqual(2);
  });

  test('Expect answer to be 8 from localDaily', () => {
    const output = longestDownwardTrend(localDaily.prices);

    expect(output.length).toStrictEqual(8);
  });

  test('Expect 1 day downward from local5min', () => {
    const output = longestDownwardTrend(filterDays(local5min).prices);

    expect(output.length).toStrictEqual(1);
  });

  test('When price only increases, expect longest to be 0', () => {
    const output = longestDownwardTrend(filterDays(local5).prices);

    expect(output.length).toStrictEqual(0);
  });
});

describe('Highest and lowest', () => {
  test('Undefined data', () => {
    const outputHighest = highest();
    const outputLowest = lowest();

    expect(outputHighest).toBeUndefined();
    expect(outputLowest).toBeUndefined();
  });

  test('Empty array', () => {
    const outputHighest = highest([]);
    const outputLowest = lowest([]);

    expect(outputHighest).toStrictEqual([]);
    expect(outputLowest).toStrictEqual([]);
  });

  test('Hourly data maximum price is 8030.890983244613', () => {
    const output = highest(filterDays(localHourly).prices);

    expect(output[1]).toStrictEqual(8030.890983244613);
  });

  test('Hourly data minimum price is 7778.216161699133', () => {
    const output = lowest(filterDays(localHourly).prices);

    expect(output[1]).toStrictEqual(7778.216161699133);
  });

  test('Negative data', () => {
    const data = [
      [0, -1],
      [1, -2],
      [2, -3],
    ];

    const highestOutput = highest(data);
    const lowestOutput = lowest(data);

    expect(highestOutput).toStrictEqual([0, -1]);
    expect(lowestOutput).toStrictEqual([2, -3]);
  });

  test('Multiple same values', () => {
    const data = [
      [0, 5],
      [1, 4],
      [2, 1],
      [3, 1],
      [4, 6],
      [5, 6],
    ];

    const highestOutput = highest(data);
    const lowestOutput = lowest(data);

    // Expect output to be the first encounter of the highest and lowest values.
    expect(highestOutput).toStrictEqual([4, 6]);
    expect(lowestOutput).toStrictEqual([2, 1]);
  });

  test('Only one element in array', () => {
    const data = [[0, 9]];

    const highestOutput = highest(data);
    const lowestOutput = lowest(data);

    expect(highestOutput).toStrictEqual([0, 9]);
    expect(lowestOutput).toStrictEqual([0, 9]);
  });
});

describe('Best time to buy and sell', () => {
  test('Empty array and undefined are handled', () => {
    const outputEmpty = timeToBuySell([]);
    const outputUndefined = timeToBuySell();

    expect(outputEmpty).toBeUndefined();
    expect(outputUndefined).toBeUndefined();
  });

  test('Only decreasing values', () => {
    const data = [
      [0, 10],
      [0, 9],
      [0, 8],
      [0, 7],
      [0, 6],
      [0, 5],
      [0, 4],
      [0, 3],
      [0, 2],
      [0, 1],
    ];

    const output = timeToBuySell(data);

    expect(output.maxProfit).toStrictEqual(0);
  });

  test('Only one value in data', () => {
    const data = [[1, 1]];
    const output = timeToBuySell(data);

    expect(output.maxProfit).toStrictEqual(0);
  });

  test('Some negative values', () => {
    const data = [
      [0, -10],
      [0, 9],
      [0, -8],
      [0, 7],
      [0, 6],
      [0, 5],
      [0, -4],
      [0, 3],
      [0, 2],
      [0, -1],
    ];

    const output = timeToBuySell(data);

    const expectedOutput = {
      buy: [0, -10],
      sell: [0, 9],
      maxProfit: 19,
      percent: -190,
    };

    expect(output).toStrictEqual(expectedOutput);
  });

  test('Hourly data is decreasing only', () => {
    const output = timeToBuySell(filterDays(localHourly).prices);

    expect(output.maxProfit).toStrictEqual(0);
  });

  test('Best time to buy and sell is late in the array', () => {
    const data = [
      [0, 1],
      [0, 9],
      [0, 9],
      [0, 6],
      [0, 4],
      [0, 0],
      [0, 1],
      [0, 3],
      [0, 2],
      [0, 10],
    ];

    const output = timeToBuySell(data);

    // Division by 0, expect percent to be -1.
    const expectedOutput = {
      buy: [0, 0],
      sell: [0, 10],
      maxProfit: 10,
      percent: -1,
    };

    expect(output).toStrictEqual(expectedOutput);
  });

  test('Price dips down lower after high', () => {
    const data = [
      [1640217684063, 43045.84892569251],
      [1640304364124, 44976.0601858963],
      [1640390494360, 44944.76575352705],
      [1640477234653, 44582.256742075435],
      [1640563562342, 44923.40101797392],
      [1640649798545, 44818.168111937994],
      [1640736029760, 42181.44257440689],
      [1640822458344, 40999.67679759019],
      [1640909093614, 41672.35465483228],
    ];

    const output = timeToBuySell(data);

    const expectedOutput = {
      buy: [1640217684063, 43045.84892569251],
      sell: [1640304364124, 44976.0601858963],
      maxProfit: 1930.2112602037887,
      percent: 4.707869454027597,
    };

    expect(output).toStrictEqual(expectedOutput);
  });
});
