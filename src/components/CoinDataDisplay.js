import React from 'react';
import { useSelector } from 'react-redux';
import { highest, lowest, longestDownwardTrend } from '../utils/dataUtils';

const CoinDataDisplay = () => {
  const coinData = useSelector((state) => state.coinData);

  const downwardTrend = longestDownwardTrend(coinData.prices);
  const highestPrice = highest(coinData.prices);
  const lowestPrice = lowest(coinData.prices);

  return (
    <div className='flexBox content'>
      {`Downward trend in days: ${downwardTrend.length}`}
      <br />
      {`Highest price: ${highestPrice[1]} €`}
      <br />
      {`Lowest price: ${lowestPrice[1]} €`}
    </div>
  );
};

export default CoinDataDisplay;
