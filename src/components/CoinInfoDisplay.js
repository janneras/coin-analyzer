import React from 'react';
import CoinSimpleInfo from './CoinInfo/CoinSimpleInfo';
import DateRangeSelector from './CoinInfo/DateRangeSelector';

const CoinInfoDisplay = () => {
  return (
    <div className='flexBox datePicker'>
      <DateRangeSelector />
      <CoinSimpleInfo />
    </div>
  );
};

export default CoinInfoDisplay;
