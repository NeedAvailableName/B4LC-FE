import * as React from 'react';
import { useState } from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo/index';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function AppSelectDate({ field, onChange, ...props } : {field: any, onChange?: any}) {
  const [selectedDate, setSelectedDate] = useState();
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']}>
        <DatePicker
          className="bg-white"
          selected={selectedDate}
          onChange={(date) => {
            setSelectedDate(date);
            onChange= () => {console.log("date: ", date)};
            field && field.onChange(date);
          }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
