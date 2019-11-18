import React, { useEffect } from 'react';
import styled from 'styled-components';
import Router from 'next/router';

import { Container, Typography, Card } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import FilledInput from '@material-ui/core/FilledInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import clsx from 'clsx';

import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import { useAuth } from '../lib/useAuth';

const ColorBox = styled.div`
  background-color: #e1e1e1;
  color: white;
  min-height: 5rem;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const StyledTypography = styled(Typography)`
  align-self: flex-start;
  font-size: 2.5rem;
`;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: theme.spacing(1),
  },
  withoutLabel: {
    marginTop: theme.spacing(3),
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  button: {
    margin: theme.spacing(1),
  },
}));

const handleChange = prop => event => {
  setValues({ ...values, [prop]: event.target.value });
};

const handleClickShowPassword = () => {
  setValues({ ...values, showPassword: !values.showPassword });
};

const handleMouseDownPassword = event => {
  event.preventDefault();
};

const Settings = () => {
  const { user, isAuthenticated } = useAuth();
  const classes = useStyles();

  const [values, setValues] = React.useState({
    amount: '',
    password: '',
    weight: '',
    weightRange: '',
    showPassword: false,
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      Router.push('/');
    }
  }, [user]);

  return (
    <div>
      {isAuthenticated() && (
        <Container maxWidth="lg">
          <ColorBox>
            <StyledTypography component="h1" variant="h6" colour="black">
              Settings
            </StyledTypography>
          </ColorBox>
          <br/>
          <ColorBox>
            <StyledTypography component="h1" variant="h6">
              Change Username
            </StyledTypography>
            <br />
            <Card style={{ width: '100%', height: '50px', align: 'center' }}>
              Current Username
            </Card>
            <form className={classes.container} noValidate autoComplete="off">
              <div>
                <TextField
                  id="outlined-basic"
                  className={classes.textField}
                  label="Current Username"
                  margin="normal"
                  variant="outlined"
                />
              </div>
            </form>
            <Card style={{ width: '100%', height: '50px' }}>New Username</Card>
            <form className={classes.container} noValidate autoComplete="off">
              <div>
                <TextField
                  id="outlined-basic"
                  className={classes.textField}
                  label="New Username"
                  margin="normal"
                  variant="outlined"
                />
              </div>
            </form>
          </ColorBox>
          <br/>
          <ColorBox>
            <StyledTypography component="h1" variant="h6">
              Change Password
            </StyledTypography>
            <br />
            <Card style={{ width: '100%', height: '50px' }}>
              Current Password
            </Card>
            <FormControl
              className={clsx(classes.margin, classes.textField)}
              variant="filled"
            >
              <InputLabel htmlFor="filled-adornment-password">
                Current Password
              </InputLabel>
              <FilledInput
                id="filled-adornment-password"
                type={values.showPassword ? 'text' : 'password'}
                value={values.password}
                onChange={handleChange('password')}
                endAdornment={
                  <InputAdornment position="right">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {values.showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <Card style={{ width: '100%', height: '50px' }}>New Password</Card>
            <FormControl
              className={clsx(classes.margin, classes.textField)}
              variant="filled"
            >
              <InputLabel htmlFor="filled-adornment-password">
                New Password
              </InputLabel>
              <FilledInput
                id="filled-adornment-password"
                type={values.showPassword ? 'text' : 'password'}
                value={values.password}
                onChange={handleChange('password')}
                endAdornment={
                  <InputAdornment position="right">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {values.showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </ColorBox>
          <br/>
          <ColorBox>
            <StyledTypography component="h1" variant="h6">
              Change Email
            </StyledTypography>
            <br />
            <Card style={{ width: '100%', height: '50px' }}>Current Email</Card>
            <form className={classes.container} noValidate autoComplete="off">
              <div>
                <TextField
                  id="outlined-basic"
                  className={classes.textField}
                  label="Current Email"
                  margin="normal"
                  variant="outlined"
                />
              </div>
            </form>
            <Card style={{ width: '100%', height: '50px' }}>New Email</Card>
            <form className={classes.container} noValidate autoComplete="off">
              <div>
                <TextField
                  id="outlined-basic"
                  className={classes.textField}
                  label="New Email"
                  margin="normal"
                  variant="outlined"
                />
              </div>
            </form>
          </ColorBox>
          <br/>
          <ColorBox>
            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
              startIcon={<DeleteIcon />}
            >
              Delete Account
            </Button>
          </ColorBox>
        </Container>
      )}
    </div>
  );
};

export default Settings;
