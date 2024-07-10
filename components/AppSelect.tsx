import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface AppSelectProps {
  label?: string;
  elements?: string[];
  disabled?: boolean;
  defaultValue?: string;
  onChange: (value: string) => void;
  [key: string]: any;
}

export default function AppSelect({
  label = '',
  elements = [],
  disabled = false,
  defaultValue = '',
  ...props
}: AppSelectProps) {
  const [option, setOption] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setOption(event.target.value as string);
    props.onChange(event.target.value as string);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth required className="bg-white">
        <InputLabel id="demo-simple-select-label" disabled={disabled}>
          {label}
        </InputLabel>
        <Select
          defaultValue={defaultValue}
          required={true}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={option}
          label={label}
          onChange={handleChange}
        >
          {elements?.map((item) => {
            return (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
}
