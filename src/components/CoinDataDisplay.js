import React from 'react';
import { useSelector } from 'react-redux';
import { highest, lowest, longestDownwardTrend } from '../utils/dataUtils';

const CoinDataDisplay = () => {
  const coinData = useSelector((state) => state.coinData);

  const downwardTrend = longestDownwardTrend(coinData.prices);
  const highestTradingVol = highest(coinData.total_volumes);
  const highestPrice = highest(coinData.prices);
  const lowestPrice = lowest(coinData.prices);

  return (
    <div className='flexBox content'>
      {coinData.prices.length > 0 ? (
        <>
          <h2>{`From ${new Date(
            coinData.startTime * 1000
          ).toLocaleDateString()} to ${new Date(
            coinData.endTime * 1000
          ).toLocaleDateString()}`}</h2>
          <h3>Longest downward trend</h3>
          {downwardTrend.length !== 0 ? (
            <>
              <p>
                {`Started on ${new Date(
                  downwardTrend.start[0]
                ).toLocaleDateString()} and ended on ${new Date(
                  downwardTrend.end[0]
                ).toLocaleDateString()}.`}
                <br />
                {`Price went from ${downwardTrend.start[1].toFixed(
                  2
                )} € to ${downwardTrend.end[1].toFixed(2)} €.`}
                <br />
                {`It lasted for ${downwardTrend.length} days.`}
              </p>
            </>
          ) : (
            <>
              <p>Price only increased withing this range.</p>
            </>
          )}
          <h3>Highest trading volume</h3>
          <p>{`Highest trading volume was ${highestTradingVol[1].toFixed(
            2
          )} €`}</p>
          <h3>Best time to buy and sell</h3>
          {}
          <p>{`Lowest price: ${lowestPrice[1].toFixed(2)} €`}</p>
        </>
      ) : (
        <>
          <p>Nothing to show, please select a date range.</p>
        </>
      )}
    </div>
  );
};

export default CoinDataDisplay;
