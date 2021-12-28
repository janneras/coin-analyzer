import React from 'react';
import { useSelector } from 'react-redux';
import BuyAndSell from './CoinData/BuyAndSell';
import DownwardTrend from './CoinData/DownwardTrend';
import HighestValue from './CoinData/HighestValue';

const CoinDataDisplay = () => {
  const coinData = useSelector((state) => state.coinData);
  const startDate = new Date(coinData.startTime * 1000).toLocaleDateString();
  const endDate = new Date(coinData.endTime * 1000).toLocaleDateString();

  return (
    <div className='flexBox content'>
      {coinData.prices.length > 0 ? (
        <>
          <h2>{`From ${startDate} to ${endDate}`}</h2>
          <DownwardTrend prices={coinData.prices} />
          <HighestValue
            valueName={'trading volume'}
            timeValuePairs={coinData.total_volumes}
          />
          <BuyAndSell prices={coinData.prices} />
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
