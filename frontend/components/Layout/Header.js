import React from 'react';
import Router from 'next/router';
import NProgress from 'nprogress';
import turquoiseBkg from '../../static/logos/turquoise-bkg.png';
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

// Progress Bar
Router.onRouteChangeStart = () => {
  NProgress.start();
};
Router.onRouteChangeComplete = () => {
  NProgress.done();
};
Router.onRouteChangeError = () => {
  NProgress.done();
};


const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuButton: {
    alignSelf: 'flex-start',
  },
  title: {
    flexGrow: 1,
  },
  icon: {
    maxHeight: '50px',
  },
  emptyDiv:{
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
  }
}));

export default function Header() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    left: false,
  });

  const toggleDrawer = (side, open) => event => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
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
        {['Dashboard', 'Settings', 'Logout'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  );


  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar className={classes.toolbar}>
            <IconButton  onClick={toggleDrawer('left', true)} className={classes.menuButton}  color="inherit" aria-label="menu">
              <MenuIcon style={{ fontSize: 38 }} />
            </IconButton>
            <img src={turquoiseBkg} className={classes.icon} alt="Logo"/>
            <div  className={classes.emptyDiv}></div>
        </Toolbar>
      </AppBar>
      <Drawer open={state.left} onClose={toggleDrawer('left', false)}>
        {sideList('left')}
      </Drawer>
    </div>
  );
}
