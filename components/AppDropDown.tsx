import { Avatar } from '@mui/material';
import Button from '@mui/material/Button';
import { red } from '@mui/material/colors';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useDisconnect } from 'wagmi';
import { Configs } from '../app-configs';

export default function AppDropDown() {
  const { data, status } = useSession();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const { disconnect } = useDisconnect();
  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        className="text-xl font-semibold text-primary p-0"
      >
        <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
          {data?.address?.slice(2, 4)}
        </Avatar>
        <div className="ml-2">
          {data?.address
            ? data.address.substring(0, 4) +
              '...' +
              data.address.substring(data.address.length - 4)
            : 'Login'}
        </div>
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={() => router.push('/user/profile')}>
          Profile
        </MenuItem>
        <MenuItem
          onClick={() => {
            signOut({
              callbackUrl: Configs.BASE_URL,
            });
            disconnect();
          }}
        >
          Logout
        </MenuItem>
      </Menu>
    </div>
  );
}
