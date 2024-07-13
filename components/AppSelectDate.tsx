import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function AppSelectDate({ onChange, ...props }) {
  const [startDate, setStartDate] = useState(null);

  const handleChange = (date) => {
    setStartDate(date);
    onChange(date);
  };

  return (
    <DatePicker
      className="bg-white border-black border rounded-sm"
      selected={startDate}
      onChange={handleChange}
      {...props}
    />
  );
}
