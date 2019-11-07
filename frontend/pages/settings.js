import { useEffect } from 'react';
import styled from 'styled-components';
import Router from 'next/router';
import { Container, Typography, Card } from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
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
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

const Settings = () => {
  const { user, isAuthenticated } = useAuth();
  const classes = useStyles();

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
            <StyledTypography component="h1" variant="h6">
              Settings
            </StyledTypography>
            <br />
            <Card style={{ width: '100%', height: '50px' }}>
              Current Password
              <form className={classes.container} noValidate autoComplete="off">
                <div>
                  <TextField
                    id="outlined-basic"
                    className={classes.textField}
                    label="Current Password"
                    margin="normal"
                    variant="outlined"
                  />
                </div>
              </form>
            </Card>
            <form className={classes.container} noValidate autoComplete="off">
              <div>
                <TextField
                  id="outlined-basic"
                  className={classes.textField}
                  label="Outlined"
                  margin="normal"
                  variant="outlined"
                />
              </div>
            </form>
            <Card style={{ width: '100%', height: '50px' }}>New Password</Card>
            <form className={classes.container} noValidate autoComplete="off">
              <div>
                <TextField
                  id="outlined-basic"
                  className={classes.textField}
                  label="Outlined"
                  margin="normal"
                  variant="outlined"
                />
              </div>
            </form>
          </ColorBox>
          <br />
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
                  label="Outlined"
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
                  label="Outlined"
                  margin="normal"
                  variant="outlined"
                />
              </div>
            </form>
          </ColorBox>
          <br />
          <ColorBox>
            <StyledTypography component="h1" variant="h6">
              Change Password
            </StyledTypography>
            <br />
            <Card style={{ width: '100%', height: '50px' }}>
              Current Password
            </Card>
            <form className={classes.container} noValidate autoComplete="off">
              <div>
                <TextField
                  id="outlined-basic"
                  className={classes.textField}
                  label="Outlined"
                  margin="normal"
                  variant="outlined"
                />
              </div>
            </form>
            <Card style={{ width: '100%', height: '50px' }}>New Password</Card>
            <form className={classes.container} noValidate autoComplete="off">
              <div>
                <TextField
                  id="outlined-basic"
                  className={classes.textField}
                  label="Outlined"
                  margin="normal"
                  variant="outlined"
                />
              </div>
            </form>
          </ColorBox>
          <br />
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
                  label="Outlined"
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
                  label="Outlined"
                  margin="normal"
                  variant="outlined"
                />
              </div>
            </form>
          </ColorBox>
          <br />
        </Container>
      )}
    </div>
  );
};

export default Settings;
