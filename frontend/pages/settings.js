import { useEffect } from 'react';
import styled from 'styled-components';
import Router from 'next/router';
import { Container, Typography, Card } from '@material-ui/core';
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
`;

const Settings = () => {
  const { user, isAuthenticated } = useAuth();

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
            <Card style={{ width: '100%', height: '50px' }}>New Password</Card>
          </ColorBox>
          <br />
          <ColorBox>
            <StyledTypography component="h1" variant="h6">
              Change Username
            </StyledTypography>
            <Card style={{ width: '100%', height: '50px' }}>New Username</Card>
          </ColorBox>
          <br />
          <ColorBox>
            <StyledTypography component="h1" variant="h6">
              Change Password
            </StyledTypography>
            <Card style={{ width: '100%', height: '50px' }}>New Password</Card>
          </ColorBox>
          <br />
          <ColorBox>
            <StyledTypography component="h1" variant="h6">
              Change Email
            </StyledTypography>
            <Card style={{ width: '100%', height: '50px' }}>New Email</Card>
          </ColorBox>
          <br />
        </Container>
      )}
    </div>
  );
};

export default Settings;
