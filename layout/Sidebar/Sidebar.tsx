import { List } from '@mui/material';
import { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import { styled } from '@mui/material/styles';
import { useSession } from 'next-auth/react';
import * as React from 'react';
import { Configs, UserRole } from '../../app-configs';
import NestedItem from '../../components/NestedList';

const drawerWidth: number = 200;
interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: 'border-box',
    ...(!open && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const SalesContractsMenu = [
  {
    nav: `${Configs.BASE_URL}/sales-contracts`,
    name: 'Sales Contracts List',
  },
  {
    nav: `${Configs.BASE_URL}/sales-contracts/create`,
    name: 'New Sales Contract',
  },
];
const LcMenu = [
  {
    nav: `${Configs.BASE_URL}/letter-of-credits`,
    name: 'Letter of Credit List',
  },
];
const DocumentMenu = [
  {
    nav: `${Configs.BASE_URL}/documents`,
    name: 'Documents List',
  },
];
const UserMenu = [
  {
    nav: `${Configs.BASE_URL}/admin`,
    name: 'User Account List',
  },
  {
    nav: `${Configs.BASE_URL}/admin/user/create`,
    name: 'New User',
  },
];
export default function Sidebar() {
  const [open, setOpen] = React.useState(true);
  const { data: session, status } = useSession();

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Drawer variant="permanent" open={open}>
          <List component="nav">
            <List
              sx={{ width: '100%', maxWidth: 300 }}
              className="h-dvh"
              component="nav"
              aria-labelledby="nested-list-subheader"
            >
              {session?.user.role !== UserRole.ADMIN && (
                <>
                  <NestedItem
                    item="Sales Contracts"
                    children={SalesContractsMenu}
                  />
                  <NestedItem item="Letter of Credits" children={LcMenu} />
                  <NestedItem item="Documents" children={DocumentMenu} />
                </>
              )}
              {session?.user.role === UserRole.ADMIN && (
                <NestedItem item="Manage User" children={UserMenu} />
              )}
            </List>
          </List>
        </Drawer>
      </Box>
    </>
  );
}
