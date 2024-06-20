import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

export default function AppButton({
  title = '',
  onClick = () => {},
  children,
  type = 'button',
  bgColor = '#3B84F5',
  textColor = '',
  form,
  icon,
  isLoading = false,
  additionalStyle = {},
  ...buttonProps
}) {
  return (
    <Button
      style={{
        backgroundColor: isLoading ? '#fff' : bgColor,
        color: buttonProps.disabled ? '#fff' : textColor,
        display: 'flex',
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        transition: 'all 0.5s',
        outline: 'none',
        border: 'none',
        borderRadius: '25px',
        ...additionalStyle,
      }}
      variant="contained"
      className="bg-indigo-500"
      onClick={onClick()}
    >
      {title}
    </Button>
  );
}
