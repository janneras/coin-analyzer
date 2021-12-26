import React, { useRef, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { inputDateToDate } from '../utils/dateUtils';
import { getRangeDays } from '../reducers/coinDataReducer';

const DateRangeSelector = () => {
  // References to update min and max value of date inputs.
  const startDateRef = useRef();
  const endDateRef = useRef();

  const dispatch = useDispatch();

  // Get todays day formatted yyyy-mm-dd to use in date input.
  const today = new Date().toISOString().split('T')[0];

  // Date object 1 year behind today.
  const lastYearDate = inputDateToDate(today, -1);

  // Set state default values to unix timestamps.
  const [startDate, setStartDate] = useState(lastYearDate.getTime() * 0.001);
  const [endDate, setEndDate] = useState(
    inputDateToDate(today).getTime() * 0.001
  );

  // useEffect to dispatch given range to coinReducer to fetch data.
  useEffect(() => {
    if (startDate && endDate) {
      dispatch(getRangeDays(startDate, endDate));
    }
  }, [startDate, endDate, dispatch]);

  return (
    <div>
      <label htmlFor='startDate'>From:</label>
      <input
        id='startDate'
        type='date'
        ref={startDateRef}
        max={today}
        defaultValue={lastYearDate.toISOString().split('T')[0]}
        onChange={(e) => {
          // Set minimum date for startDate input.
          endDateRef.current.min = e.target.value;
          // valueAsNumber is unix timestamp in milliseconds, format to seconds.
          setStartDate(e.target.valueAsNumber * 0.001);
        }}
      />
      <label htmlFor='endDate'>To:</label>
      <input
        id='endDate'
        type='date'
        ref={endDateRef}
        max={today}
        defaultValue={today}
        onChange={(e) => {
          // Set maximum date for endDate input.
          startDateRef.current.max = e.target.value;
          // valueAsNumber is unix timestamp in milliseconds, format to seconds.
          setEndDate(e.target.valueAsNumber * 0.001);
        }}
      />
    </div>
  );
};

export default DateRangeSelector;
