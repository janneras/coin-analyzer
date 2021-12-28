import React from 'react';
import { formatCurrency } from '../../utils/currencyUtils';
import { timeToBuySell } from '../../utils/dataUtils';
import { formatDate } from '../../utils/dateUtils';

const BuyAndSell = ({ prices }) => {
  const buySell = timeToBuySell(prices);
  const buyDate = formatDate(buySell.buy[0]);
  const sellDate = formatDate(buySell.sell[0]);
  const buyValue = formatCurrency(buySell.buy[1]);
  const sellValue = formatCurrency(buySell.sell[1]);
  const profit = formatCurrency(buySell.maxProfit);

  return (
    <>
      <h3>Best time to buy and sell</h3>
      {prices.length !== 1 ? (
        <>
          {' '}
          {buySell.maxProfit !== 0 ? (
            <p>
              {`Best time to buy is on ${buyDate} for a value of ${buyValue}.`}
              <br />
              {`Best time to sell is on ${sellDate} for a value of ${sellValue}.`}
              <br />
              {`Making a profit of ${profit} per coin increasing in value by
           ${buySell.percent.toFixed(2)}%.`}
            </p>
          ) : (
            <p>
              Price only decreased in the given timeframe so there is no best
              time to buy or sell.
            </p>
          )}
        </>
      ) : (
        <>
          Cannot calculate best times to buy and sell for 1 day timeframe.
          <br />
          Increase timeframe to get data for the best times to buy and sell.
        </>
      )}
    </>
  );
};

export default BuyAndSell;
