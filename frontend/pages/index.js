import React from 'react';
import { Container } from '@material-ui/core';
import styled from 'styled-components';
import Link from 'next/link';
import { useAuth } from '../lib/useAuth';
import { LargeButton } from '../components/Button';

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
  const { isAuthenticated } = useAuth();
  return (
    <ContentBox maxWidth="xs">
      <LargeLogo
        src="https://res.cloudinary.com/dzowh11b5/image/upload/v1571582804/comp3900/logo-turquoise_h2ssgm.png"
        alt="Tradie logo"
      />
      <ButtonContainer>
        <Link href={isAuthenticated() ? '/dashboard' : '/login'}>
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
  );
};
export default Index;
