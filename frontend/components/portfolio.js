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
import { LargeLogo } from './Logo';
import { useAuth } from '../lib/useAuth';

const StyledPaper = styled(Paper)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  background-color:black;
`;

const ContentBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${({theme}) =>  `${theme.lightgrey}`}
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

const Portfolio = () => {
  const [values, setValues] = useState({ failedLogin: false})
  const { login, user, isAuthenticated} = useAuth();

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
    } else {
      Router.push('/dashboard');
    }
    
  };

  const handleInputChange = e => {
    const {name, value} = e.target
    setValues({...values, [name]: value})
    setValues({...values, failedLogin: false})

  };
  

  return (
      <ContentBox>
        <StyledPaper>
          
        </StyledPaper>
      </ContentBox>
  );
};

export default Portfolio;
