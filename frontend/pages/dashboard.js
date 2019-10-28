import React from 'react';
import styled from 'styled-components';
import { Container, Grid, useMediaQuery } from '@material-ui/core';
import CreatePortfolioForm from '../components/Portfolio/CreatePortfolioForm';
import Typography from '@material-ui/core/Typography';

import PortfolioItem  from '../components/Portfolio/PortfolioItem';

const ColorBox = styled.div`
  background-color: ${({ theme }) => `${theme.lightgrey}`};
  color: white;
  min-height: 5rem;
  padding: 1rem 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const StyledTypography = styled(Typography)`
  align-self: flex-start;
`;

const Dashboard = () => {
  const isSmall = useMediaQuery('(max-width: 600px)');
  return (
    <div>
      <Container maxWidth="lg">
        <Grid container spacing={3} direction={isSmall ? 'column' : 'row'}>
          <Grid item xs={12}>
            <ColorBox>
              <StyledTypography component="h1" variant="h6">Portfolio</StyledTypography>
              <PortfolioItem m={10}/>
              <CreatePortfolioForm/>
            </ColorBox>
          </Grid>
          <Grid item xs={12} sm={8}>
            <ColorBox>
              <StyledTypography component="h1" variant="h6">Newsfeed</StyledTypography>
            </ColorBox>
          </Grid>
          <Grid item xs={12} sm={4}>
            <ColorBox>
              <StyledTypography component="h1" variant="h6">Stocks</StyledTypography>
            </ColorBox>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Dashboard;
