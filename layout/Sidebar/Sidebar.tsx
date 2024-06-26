import * as React from 'react';
import NestedItem from '../../components/NestedList';
import type { GetServerSideProps, NextPage } from 'next';
import Box from '@mui/material/Box';
import {
  Badge,
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  List,
  Paper,
  Typography,
} from '@mui/material';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Configs } from '../../app-configs';

const drawerWidth: number = 200;
interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

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
export default function Sidebar() {
  const [open, setOpen] = React.useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
  };
  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Drawer variant="permanent" open={open}>
          {/* <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar> */}
          {/* <Divider /> */}
          <List component="nav">
            <List
              sx={{ width: '100%', maxWidth: 300 }}
              className="h-dvh"
              component="nav"
              aria-labelledby="nested-list-subheader"
            >
              <NestedItem
                item="Sales Contracts"
                children={SalesContractsMenu}
              />
              <NestedItem item="Letter of Credits" children={LcMenu} />
              <NestedItem item="Documents" children={DocumentMenu} />
            </List>
          </List>
        </Drawer>
      </Box>
    </>
  );
}
