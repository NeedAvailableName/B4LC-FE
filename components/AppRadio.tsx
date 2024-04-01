import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export default function AppRadio({ field, className, elements } : {className?: string, elements: string[]}) {
  const [value, setValue] = React.useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
    field.onChange((event.target as HTMLInputElement).value);
  };

  return (
    <FormControl className={className}>
      <RadioGroup
        aria-labelledby="demo-controlled-radio-buttons-group"
        name="controlled-radio-buttons-group"
        value={value}
        onChange={handleChange}
      >
        {elements.map((item) => {
          return (
            <FormControlLabel value={item} control={<Radio />} label={item} />
          );
        })}
      </RadioGroup>
    </FormControl>
  );
}
