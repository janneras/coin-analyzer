import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getInfo } from '../../reducers/coinInfoReducer';
import { formatCurrency } from '../../utils/currencyUtils';

const CoinSimpleInfo = () => {
  const coinInfo = useSelector((state) => state.coinInfo);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getInfo(coinInfo.id));
  }, [coinInfo.id, coinInfo.currency, dispatch]);

  return (
    <div>
      <h2 style={{ marginTop: '1rem' }}>Currently selected coin</h2>
      {coinInfo ? (
        <>
          <img src={coinInfo.image.thumb} alt={`${coinInfo.name}`} />
          <p>
            {' '}
            {`${coinInfo.name} [${coinInfo.symbol}]`}
            <br />
            {coinInfo.current_price ? (
              <>{`Current price: ${formatCurrency(
                coinInfo.current_price,
                coinInfo.currency
              )}`}</>
            ) : (
              <></>
            )}
          </p>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default CoinSimpleInfo;
