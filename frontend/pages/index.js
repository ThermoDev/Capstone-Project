import React, {useEffect } from 'react';
import { Container } from '@material-ui/core';
import styled from 'styled-components';
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

const Index = () => {

  const { isAuthenticated, user } = useAuth();
  useEffect(() => {
    if (isAuthenticated()) {
      Router.push('/dashboard');
    } 
  }, [user]);
  return (
    <Login/>
  );
};
export default Index;
