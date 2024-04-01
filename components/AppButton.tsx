import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

export default function AppButton({ title = '', onClick = () => {} } : {title: string, onClick?: Function}) {
  return (
    <Button variant="contained" className="bg-indigo-500" onClick={onClick()}>
      {title}
    </Button>
  );
}
