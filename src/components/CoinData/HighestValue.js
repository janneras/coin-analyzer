import React from 'react';
import { formatCurrency } from '../../utils/currencyUtils';
import { highest } from '../../utils/dataUtils';
import { formatDate } from '../../utils/dateUtils';

const HighestValue = ({ valueName, timeValuePairs, currency }) => {
  const highestValue = highest(timeValuePairs);
  const highestFormatted = formatCurrency(highestValue[1], currency);
  const date = formatDate(highestValue[0]);

  return (
    <>
      <h3>{`Highest ${valueName}`}</h3>
      <p>{`Highest ${valueName} was ${highestFormatted} on ${date}.`}</p>
    </>
  );
};

export default HighestValue;
