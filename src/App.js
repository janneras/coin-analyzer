import React from 'react';
import CoinDataDisplay from './components/CoinDataDisplay';
import CoinInfoDisplay from './components/CoinInfoDisplay';
import './styles/index.css';

export default function App() {
  return (
    <>
      <h1>Scrooge McDuck Coin Analyzer</h1>
      <div className='container'>
        <CoinInfoDisplay />
        <CoinDataDisplay />
      </div>
      <p className='footer'>
        Janne Räsänen - Vincit Rising Star Pre-assignment 2021 -{' '}
        <a href='https://github.com/janneras/coin-analyzer'>Source code</a>
      </p>
    </>
  );
}
