import React, { useEffect } from 'react';
import styled from 'styled-components';
import Router, { useRouter } from 'next/router';
import Link from 'next/link';
import LinkMui from '@material-ui/core/Link';
import {
  Grid,
  Container,
  Paper,
  Typography,
  Button,
  TextField,
  CircularProgress,
} from '@material-ui/core';
import { LargeLogo } from '../components/Logo';
import { useAuth } from '../lib/useAuth';
import { InlineError } from '../components/Error';

/*
  Login page

  Component Type: Login Form

  Description:
  - Users can enter Username and password
  - Users can navigate to sign up page


*/

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
  margin: ${({ theme }) => theme.mui.spacing(1, 0, 1)};
`;

const StyledTextField = styled(TextField)`
  font-size: ${({ theme }) => theme.font.md};
`;

const Login = () => {
  const { login, user, isAuthenticated, isLoading, isError, error, isSuccess } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      Router.push('/dashboard');
    }
  }, [user]);

  useEffect(() => {
    router.prefetch('/dashboard');
  });

  const handleSubmit = e => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    login(email, password);
  };

  return (
    <Container component="main" maxWidth="xs">
      <ContentBox>
        <StyledLargeLogo />
        <StyledPaper>
          {(isLoading && (
            <>
              <CircularProgress />
            </>
          )) || (
            <>
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
                  error={isError}
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
                  error={isError}
                />
                {isError && <InlineError error={error} />}
                {isSuccess && !isError && <Typography color="primary" variant="body2">Account created!</Typography>}
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
            </>
          )}
        </StyledPaper>
      </ContentBox>
    </Container>
  );
};

export default Login;
