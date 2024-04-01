import * as React from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import NestedItem from '../../components/NestedList';
import PrimaryNavItem from './PrimaryNavItem';
import { IcDocumentWaitForReview } from '../../assets/svgs';

const SalesContractsMenu = [
  {
    nav: 'sales-contracts/create',
    name: 'New Sales Contract'
  },
]
const LcMenu = [
  {
    nav: 'letter-of-credits/create', 
    name: 'New Letter of Credit'
  }
]
const DocumentMenu = [
  {
    nav: 'documents/create',
    name: 'New Documents'
  }
]
export default function Sidebar() {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <List
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
      <NestedItem item='Sales Contracts' children={SalesContractsMenu}/>
      <NestedItem item='Letter of Credits' children={LcMenu}/>
      <NestedItem item='Documents' children={DocumentMenu}/>
    </List>
  );
}