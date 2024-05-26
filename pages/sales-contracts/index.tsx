import Box from '@mui/material/Box';
import {
  AppBar,
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
import Layout from '../../layout';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import SalesContractsList from '../../layout/SalesContractList';

export default function SalesContracts() {
  return (
    <Layout>
      <SalesContractsList></SalesContractsList>
    </Layout>
  );
}
