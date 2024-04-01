import { ListItemButton } from '@mui/material';
import { navItemStyle } from './styles';

export default function PrimaryNavItem({ onClickHandler, icon, title, isOpen }) {
    return (
        <div className="title_header" onClick={onClickHandler}>
            <div style={{ display: 'flex' }}>
                <div style={navItemStyle}>{icon}</div>
                <div className="header-text">{title}</div>
            </div>
            {isOpen && <ListItemButton />}
        </div>
    );
}
