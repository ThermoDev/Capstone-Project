import React, { useEffect } from 'react';
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

const LargeLogo = styled.img`
  margin-top: ${({ theme }) => `${theme.mui.spacing(8)}px`};
`;

const SubmitButton = styled(Button)`
  margin: ${({ theme }) => theme.mui.spacing(3, 0, 2)};
`;

const StyledTextField = styled(TextField)`
  font-size: ${({ theme }) => theme.font.md};
`;

const Login = () => {
  const { login, user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated()) {
      Router.push('/dashboard');
    }
  }, [user]);

  const handleSubmit = e => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    login(email, password);
  };

  return (
    <Container component="main" maxWidth="xs">
      <ContentBox>
        <LargeLogo
          src="https://res.cloudinary.com/dzowh11b5/image/upload/v1571582804/comp3900/logo-turquoise_h2ssgm.png"
          alt="Logo"
        />
        <StyledPaper>
          <Typography component="h1" variant="h5">
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
            />
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
