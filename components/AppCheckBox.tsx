import * as React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Typography } from '@mui/material';
import { useForm } from 'react-hook-form';

export default function AppCheckBox({ label = '', elements, ...props }) {
  const [itemArray, setItemArray] = React.useState([]);
  const { register, handleSubmit, watch, errors } = useForm();
  return (
    <>
      <Typography>{label}</Typography>
      <FormGroup>
        {elements.map((item) => {
          return <FormControlLabel control={<Checkbox name={item.name} />} label={item?.label} />;
        })}
      </FormGroup>
    </>
  );
}
