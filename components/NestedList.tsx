import React, { useState } from 'react';
import { List, ListItemButton } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Link from 'next/link';

const NestedItem = ({
  item,
  children,
}: {
  item: string;
  children: any;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleIsOpen = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <List>
      <ListItem onClick={handleIsOpen}>
        <ListItemText primary={item} />
        {isOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <List>
        {children?.map((item) => (
          <Link href={item.nav}>
            <ListItem divider>
              <Collapse in={isOpen}>
                <List>
                  <ListItem>
                    <ListItemButton>
                      <ListItemText primary={item.name} />
                    </ListItemButton>
                  </ListItem>
                </List>
              </Collapse>
            </ListItem>
          </Link>
        ))}
      </List>
    </List>
  );
};

export default NestedItem;
