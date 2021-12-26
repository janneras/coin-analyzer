import React, { Fragment } from 'react';
import CoinDataDisplay from './components/CoinDataDisplay';
import DateRangeSelector from './components/DateRangeSelector';

export default function App() {
  return (
    <Fragment>
      <h1>Scrooge McDuck Coin Analyzer</h1>
      <DateRangeSelector />
      <CoinDataDisplay />
    </Fragment>
  );
}
