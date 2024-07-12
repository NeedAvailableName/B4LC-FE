import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import * as React from 'react';

export default function AppRadio({
  className,
  elements,
  ...props
}: {
  className?: string;
  elements: string[];
}) {
  const [value, setValue] = React.useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
    props.onChange((event.target as HTMLInputElement).value);
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
            <FormControlLabel
              value={item}
              key={item}
              control={<Radio required={true} />}
              label={item}
            />
          );
        })}
      </RadioGroup>
    </FormControl>
  );
}
