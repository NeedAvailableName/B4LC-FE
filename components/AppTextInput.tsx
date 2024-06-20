import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Controller, useForm, useFormContext } from 'react-hook-form';

export default function AppTextInput({
  rows,
  placeholder,
  disabled = false,
  ...props
}) {
  const [inputValue, setInputValue] = React.useState('');
  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { width: '100%' },
      }}
      noValidate
      autoComplete="off"
    >
      <div className="rounded ">
        <TextField
          multiline={true}
          rows={rows}
          className="bg-white"
          id="outlined-required"
          {...props}
          placeholder={placeholder}
          disabled={disabled}
        />
      </div>
    </Box>
  );
}
