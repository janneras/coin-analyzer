import React from 'react';
import { formatCurrency } from '../../utils/currencyUtils';
import { longestDownwardTrend } from '../../utils/dataUtils';
import { formatDate } from '../../utils/dateUtils';

const DownwardTrend = ({ prices, currency }) => {
  const downwardTrend = longestDownwardTrend(prices);
  const startDate = formatDate(downwardTrend.start[0]);
  const endDate = formatDate(downwardTrend.end[0]);
  const startValue = formatCurrency(downwardTrend.start[1], currency);
  const endValue = formatCurrency(downwardTrend.end[1], currency);
  const lengthString =
    downwardTrend.length === 1
      ? `${downwardTrend.length} day`
      : `${downwardTrend.length} days`;

  return (
    <>
      <h3>Longest downward trend</h3>
      {prices.length !== 1 ? (
        <>
          {downwardTrend.length !== 0 ? (
            <>
              <p>
                {`Started on ${startDate} and ended on ${endDate}.`}
                <br />
                {`Price went from ${startValue} to ${endValue}.`}
                <br />
                {`It lasted for ${lengthString}.`}
              </p>
            </>
          ) : (
            <>
              <p>Price only increased withing this range.</p>
            </>
          )}
        </>
      ) : (
        <>
          <p>
            Cannot calculate downward trend for 1 day timeframe.
            <br />
            Increase timeframe to get data for downward trend.
          </p>
        </>
      )}
    </>
  );
};

export default DownwardTrend;
