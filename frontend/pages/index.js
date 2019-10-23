import React, { useEffect } from 'react';
import { Container } from '@material-ui/core';
import styled from 'styled-components';
import Link from 'next/link';
import Router from 'next/router';
import { useAuth } from '../lib/useAuth';
import Login from './login';
import Router from 'next/router';
import Dashboard from './dashboard';

const ContentBox = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: ${({ theme }) => `${theme.mui.spacing(8)}px`};
`;

const LargeLogo = styled.img`
  width: 500px;
  height: 100%;
`;

const ButtonContainer = styled.div`
  display: flex;

  & > * {
    margin: 1rem;
  }
`;

// TODO: have a loading page before showing buttons
const Index = () => {
<<<<<<< HEAD

  const { isAuthenticated, user } = useAuth();
  useEffect(() => {
    if (isAuthenticated()) {
      Router.push('/dashboard');
    } 
  }, [user]);
  return (
    <Login/>
=======
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated()) {
      Router.push('/dashboard');
    }
  }, [user]);

  return (
    <ContentBox maxWidth="xs">
      <LargeLogo
        src="https://res.cloudinary.com/dzowh11b5/image/upload/v1571582804/comp3900/logo-turquoise_h2ssgm.png"
        alt="Tradie logo"
      />
      <ButtonContainer>
        <Link href="/login">
          <LargeButton variant="contained" color="secondary">
            Login
          </LargeButton>
        </Link>
        <Link href="/register">
          <LargeButton variant="contained" color="secondary">
            Register
          </LargeButton>
        </Link>
      </ButtonContainer>
    </ContentBox>
>>>>>>> 20f91dac18caa817b221a22d9a155f2ed8baf0ca
  );
};
export default Index;
