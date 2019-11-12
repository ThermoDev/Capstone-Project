import React, { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import ListItemText from '@material-ui/core/ListItemText';
import { useAuth } from '../../lib/useAuth';
import turquoiseBkg from '../../static/logos/turquoise-bkg.png';

const StyledToolbar = styled(Toolbar)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledSidebar = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 15px;
`;

const StyledAppbar = styled(AppBar)`
  background-color: ${({ theme }) => `${theme.turquoise}`};
`;

export default function Header() {
  const { logout, user } = useAuth();

  const [state, setState] = useState({
    left: false,
  });

  const toggleDrawer = (side, open) => event => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setState({ [side]: open });
  };

  const sideList = side => (
    <div
      role="presentation"
      onClick={toggleDrawer(side, false)}
      onKeyDown={toggleDrawer(side, false)}
      style={{ padding: '15px', width: 250 }}
    >
      <StyledSidebar>
        <Avatar style={{ backgroundColor: '#00ced1', marginBottom: '15px' }}>
          {user.firstName.charAt(0)}
        </Avatar>
        <Typography>{user.firstName}</Typography>
      </StyledSidebar>
      <Divider />
      <List>
        <Link href="/dashboard">
          <ListItem button key="Dashboard">
            <ListItemText primary="Dashboard" />
          </ListItem>
        </Link>
        <Link href="/play">
          <ListItem button key="Play">
            <ListItemText primary="Play" />
          </ListItem>
        </Link>
        <Link href="/settings">
          <ListItem button key="Settings">
            <ListItemText primary="Settings" />
          </ListItem>
        </Link>
        <ListItem button key="Logout" onClick={() => logout()}>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <div style={{ flexGrow: 1 }}>
      <StyledAppbar position="static" color="primary">
        <StyledToolbar>
          <IconButton
            onClick={toggleDrawer('left', true)}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon style={{ fontSize: 38 }} />
          </IconButton>
          <img src={turquoiseBkg} alt="Logo" styled={{ maxHeight: '50px' }} />
          <div styled={{ minWidth: '38px' }} />
        </StyledToolbar>
      </StyledAppbar>
      <Drawer open={state.left} onClose={toggleDrawer('left', false)}>
        {sideList('left')}
      </Drawer>
    </div>
  );
}
