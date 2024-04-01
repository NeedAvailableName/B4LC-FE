import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useForm, useFormContext } from 'react-hook-form';

export default function AppTextInput({
  name,
  ...props
}) {
  const [inputValue, setInputValue] = React.useState('');
  const { register, formState: { errors } } = useForm();
  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '100%' },
      }}
      noValidate
      autoComplete="off"
    >
      <div className="w-full p-2 rounded ">
        <TextField
          className="bg-white"
          id="outlined-required"
          {...register(name)}
          {...props}
        />
      </div>
    </Box>
  );
}
