import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Router from 'next/router';
import Link from 'next/link';
import LinkMui from '@material-ui/core/Link';
import {
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
} from '@material-ui/core';
import { LargeLogo } from '../components/Logo';
import { useAuth } from '../lib/useAuth';
import { InlineError } from '../components/Error';

/*
  Register Page

  Component Type: Sign up Form

  Description:
  - Users can enter details to sign up
  - Catches errors
  - Can navigate to Sign up page


*/

const StyledPaper = styled(Paper)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
`;

const StyledForm = styled.form`
  width: '100%';
  margin-top: ${({ theme }) => `${theme.mui.spacing(1)}px`};
`;

const SubmitButton = styled(Button)`
  margin: ${({ theme }) => theme.mui.spacing(3, 0, 2)};
`;

const nameRegex = /[A-Za-z\s]+/;

const validateEmail = email => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const Register = () => {
  const [values, setValues] = useState({
    invalidEmail: false,
    invalidPassword: false,
    invalidFirstName: false,
    invalidLastName: false,
  });
  const {
    user,
    isAuthenticated,
    register,
    isError,
    error,
    isSuccess,
  } = useAuth();

  const handleSubmit = e => {
    e.preventDefault();
    const firstName = e.target.firstName.value;
    const lastName = e.target.lastName.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (password.length < 8 || !validateEmail(email)) {
      setValues({
        invalidEmail: !validateEmail(email),
        invalidPassword: password.length < 8,
        invalidFirstName: !nameRegex.test(firstName),
        invalidLastName: !nameRegex.test(lastName),
      });
    } else {
      setValues({
        invalidEmail: false,
        invalidPassword: false,
        invalidFirstName: false,
        invalidLastName: false,
      });
      register(email, firstName, lastName, password);
    }
  };

  useEffect(() => {
    if (isSuccess && !isError) {
      Router.push('/login');
    }
  }, [isSuccess]);

  return (
    <Container component="main" maxWidth="xs">
      <LargeLogo />
      <StyledPaper>
        <Typography
          component="h1"
          variant="h4"
          style={{ paddingBottom: '1rem' }}
        >
          Sign up
        </Typography>
        <StyledForm noValidate onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                error={values.invalidFirstName}
                helperText={
                  values.invalidFirstName ? 'Must only contain characters.' : ''
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
                error={values.invalidLastName}
                helperText={
                  values.invalidLastName ? 'Must only contain characters.' : ''
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                error={values.invalidEmail}
                helperText={values.invalidEmail ? 'Invalid email address.' : ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                error={values.invalidPassword}
                helperText={
                  values.invalidPassword
                    ? 'Invalid Password. Must be 8 or more characters'
                    : ''
                }
              />
            </Grid>
          </Grid>
          {isError && <InlineError error={error} />}
          <SubmitButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
          >
            Sign Up
          </SubmitButton>
          <Grid container justify="center">
            <Grid item>
              <Link href="/login">
                <LinkMui component="button" variant="body2">
                  Already have an account? Sign in
                </LinkMui>
              </Link>
            </Grid>
          </Grid>
        </StyledForm>
      </StyledPaper>
    </Container>
  );
};
export default Register;
