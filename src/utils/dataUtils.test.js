import { filterDays } from '../utils/dataUtils';

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
    expect(output.prices).toHaveLength(3);
    const prices = [...output.prices];
    // 2020-01-19 at 00:04:42.472 UTC
    const firstDay = 1579392282472;
    // 2020-01-20 at 00:04:24.166 UTC
    const secondDay = 1579478664166;
    // 2020-01-21 at 00:07:43.674 UTC
    const lastDay = 1579565263674;

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
