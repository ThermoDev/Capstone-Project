import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Router from 'next/router';
import Link from 'next/link';
import LinkMui from '@material-ui/core/Link';
import {
  Grid,
  Container,
  Paper,
  Typography,
  Button,
  TextField,
} from '@material-ui/core';
import { LargeLogo } from '../components/Logo';
import { useAuth } from '../lib/useAuth';

const StyledPaper = styled(Paper)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
`;

const ContentBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledForm = styled.form`
  width: '100%';
  margin-top: ${({ theme }) => `${theme.mui.spacing(1)}px`};
`;

const StyledLargeLogo = styled(LargeLogo)`
  margin-top: ${({ theme }) => `${theme.mui.spacing(8)}px`};
`;

const SubmitButton = styled(Button)`
  margin: ${({ theme }) => theme.mui.spacing(3, 0, 2)};
`;

const StyledTextField = styled(TextField)`
  font-size: ${({ theme }) => theme.font.md};
`;

const Login = () => {
  const [values, setValues] = useState({ failedLogin: false})
  const { login, user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated()) {
      Router.push('/dashboard');
    } 
  }, [user]);

  const handleSubmit = async e => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const loginSuccess = await login(email, password);
    if (!loginSuccess){
      setValues({...values, failedLogin: !isAuthenticated()})
    }
    
    
  };

  const handleInputChange = e => {
    const {name, value} = e.target
    setValues({...values, [name]: value})
    setValues({...values, failedLogin: false})

  };
  

  return (
    <Container component="main" maxWidth="xs">
      <ContentBox>
        <StyledLargeLogo />
        <StyledPaper>
          <Typography component="h1" variant="h4">
            Sign in
          </Typography>
          <StyledForm noValidate onSubmit={handleSubmit}>
            <StyledTextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={()=> setValues({...values, failedLogin: false})}
              error={values.failedLogin}

            />
            <StyledTextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              error={values.failedLogin}
              onChange={()=> setValues({...values, failedLogin: false})}
            />
            {values.failedLogin ? (<Typography color='error' component="h3" variant="body1">
            Invalid email and password.
            </Typography>) :(null)}
            <SubmitButton
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
            >
              Sign In
            </SubmitButton>
            <Grid container>
              <Grid item xs>
                <Link href="/">
                  <LinkMui component="button" variant="caption">
                    Forgot password?
                  </LinkMui>
                </Link>
              </Grid>
              <Grid item>
                <Link href="/register">
                  <LinkMui component="button" variant="caption">
                    Don't have an account? Sign Up
                  </LinkMui>
                </Link>
              </Grid>
            </Grid>
          </StyledForm>
        </StyledPaper>
      </ContentBox>
    </Container>
  );
};

export default Login;
