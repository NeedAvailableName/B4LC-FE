import React, { useState } from 'react';
import { List, ListItemButton } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Link from 'next/link';

const NestedItem = ({ item, children }: { item: string; children: any }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleIsOpen = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <List className='p-0'>
      <ListItem onClick={handleIsOpen}>
        <ListItemText primary={item} />
        {isOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <List>
        {children?.map((item) => (
          <Link href={item.nav}>
            <Collapse in={isOpen}>
                <ListItem>
                  <ListItemText primary={item.name}/>
                </ListItem>
            </Collapse>
          </Link>
        ))}
      </List>
    </List>
  );
};

export default NestedItem;
