import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { List } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Link from 'next/link';
import { useState } from 'react';

const NestedItem = ({ item, children }: { item: string; children: any }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleIsOpen = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <List className="p-0">
      <ListItem onClick={handleIsOpen}>
        <ListItemText primary={item} />
        {isOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <List>
        {children?.map((item) => (
          <Link href={item.nav} key={item}>
            <Collapse in={isOpen}>
              <ListItem>
                <ListItemText primary={item.name} />
              </ListItem>
            </Collapse>
          </Link>
        ))}
      </List>
    </List>
  );
};

export default NestedItem;
