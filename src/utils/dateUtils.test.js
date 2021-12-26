import { inputDateToDate } from './dateUtils';

describe('Date formatter', () => {
  test('From input date string, get date object at 00:00:00 UTC', () => {
    const date = '2021-12-12'; // yyyy-mm-dd
    const output = inputDateToDate(date);
    expect(output.getUTCFullYear()).toStrictEqual(2021);
    // Thanks to date object shenanigans month is returned starting from 0.
    expect(output.getUTCMonth()).toStrictEqual(11);
    expect(output.getUTCDate()).toStrictEqual(12);
    expect(output.getUTCHours()).toStrictEqual(0);
    expect(output.getUTCMinutes()).toStrictEqual(0);
    expect(output.getUTCSeconds()).toStrictEqual(0);
  });

  test('Offset day, month and year by 1', () => {
    // Expected behaviour is to rollover to next year and month.
    const date = '2021-12-12'; // yyyy-mm-dd
    const output = inputDateToDate(date, 1, 1, 1);
    expect(output.getUTCFullYear()).toStrictEqual(2023);
    // Thanks to date object shenanigans month is returned starting from 0.
    expect(output.getUTCMonth()).toStrictEqual(0);
    expect(output.getUTCDate()).toStrictEqual(13);
    expect(output.getUTCHours()).toStrictEqual(0);
    expect(output.getUTCMinutes()).toStrictEqual(0);
    expect(output.getUTCSeconds()).toStrictEqual(0);
  });

  test('Empty input returns todays date without hours.', () => {
    const output = inputDateToDate();

    const today = new Date();

    expect(output.getUTCFullYear()).toStrictEqual(today.getUTCFullYear());
    // Thanks to date object shenanigans month is returned starting from 0.
    expect(output.getUTCMonth()).toStrictEqual(today.getUTCMonth());
    expect(output.getUTCDate()).toStrictEqual(today.getUTCDate());
    expect(output.getUTCHours()).toStrictEqual(0);
    expect(output.getUTCMinutes()).toStrictEqual(0);
    expect(output.getUTCSeconds()).toStrictEqual(0);
  });

  test('Malformatted input returns todays date without hours.', () => {
    const output = inputDateToDate('2021.12.12');

    const today = new Date();

    expect(output.getUTCFullYear()).toStrictEqual(today.getUTCFullYear());
    // Thanks to date object shenanigans month is returned starting from 0.
    expect(output.getUTCMonth()).toStrictEqual(today.getUTCMonth());
    expect(output.getUTCDate()).toStrictEqual(today.getUTCDate());
    expect(output.getUTCHours()).toStrictEqual(0);
    expect(output.getUTCMinutes()).toStrictEqual(0);
    expect(output.getUTCSeconds()).toStrictEqual(0);
  });
});
