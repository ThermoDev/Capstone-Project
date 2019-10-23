import React from 'react';
import Link from "next/link";
import { useAuth } from '../../lib/useAuth';
import { makeStyles } from '@material-ui/core/styles';
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
import turquoiseBkg from '../../static/logos/turquoise-bkg.png';


const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    flexGrow: 1,
  },
  icon: {
    maxHeight: '50px',
  },
  emptyDiv: {
    minWidth: '38px',
  },
  list: {
    padding: '15px',
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  avatar: {
    backgroundColor: '#00ced1',
    marginBottom: '15px',
  },
  sidebar1: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '15px',
  },
}));

export default function Header() {
  const { logout } = useAuth();

  const classes = useStyles();
  const [state, setState] = React.useState({
    left: false,
  });

  const handleSubmit = e => {
    logout();
  };

  const toggleDrawer = (side, open) => event => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setState({ ...state, [side]: open });
  };

  const sideList = side => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer(side, false)}
      onKeyDown={toggleDrawer(side, false)}
    >
      <div className={classes.sidebar1}>
        <Avatar className={classes.avatar}>U</Avatar>
        <Typography>User</Typography>
      </div>
      <Divider />
      <List>
        <Link href='Dashboard' passHref>
          <ListItem button key='Dashboard'>
            <ListItemText primary='Dashboard' />
          </ListItem>
        </Link>
        <Link href='Dashboard' passHref>
          <ListItem button key='Settings'>
            <ListItemText primary='Settings' />
          </ListItem>
        </Link>
        <Link href='/'  passHref>
          <ListItem button key='Logout'  onClick={handleSubmit}>
            <ListItemText primary='Logout' />
          </ListItem>
        </Link>
      </List>
    </div>
  );

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar className={classes.toolbar}>
          <IconButton
            onClick={toggleDrawer('left', true)}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon style={{ fontSize: 38 }} />
          </IconButton>
          <img src={turquoiseBkg} className={classes.icon} alt="Logo" />
          <div className={classes.emptyDiv} />
        </Toolbar>
      </AppBar>
      <Drawer open={state.left} onClose={toggleDrawer('left', false)}>
        {sideList('left')}
      </Drawer>
    </div>
  );
}
