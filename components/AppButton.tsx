import Button from '@mui/material/Button';

interface IAppButton {
  title: any;
  onClick: any;
  children: any;
  type: any;
  bgColor: any;
  textColor: any;
  form: any;
  icon: any;
  isLoading: any;
  additionalStyle: any;
  buttonProps: any;
}
export default function AppButton({
  title = '',
  onClick = () => {},
  children: any,
  type = 'button',
  bgColor = '#3B84F5',
  textColor = '',
  form,
  icon,
  isLoading = false,
  additionalStyle = {},
  ...buttonProps
}: IAppButton) {
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
