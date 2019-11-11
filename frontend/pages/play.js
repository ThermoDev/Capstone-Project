import { useEffect, memo } from 'react';
import styled from 'styled-components';
import {
  Container,
  Grid,
  useMediaQuery,
  Typography,
  Card,
} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import Router from 'next/router';
import get from 'lodash.get';
import { useAuth } from '../lib/useAuth';
import useApi from '../lib/useApi';

import PortfolioItem from '../components/Portfolio/PortfolioItem';
import CreateGameForm from '../components/Game/CreateGameForm';

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

const CenterBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Dashboard = () => {
  const isSmall = useMediaQuery('(max-width: 600px)');
  const { user, isAuthenticated } = useAuth();
  const { state, getPortfolios, getRandomNews, getRandomStocks } = useApi();
  const { portfolios, news, randomStocks } = state;

  // loading variables
  const portfoliosLoading = get(portfolios, 'isLoading', true);
  const stocksLoading = get(randomStocks, 'isLoading', true);
  const newsLoading = get(news, 'isLoading', true);

  // data extraction
  const portfoliosData = get(portfolios, 'data', []);
  const stocksData = get(randomStocks, 'data', []);
  const newsData = get(news, 'data.articles', []);

  useEffect(() => {
    if (isAuthenticated()) {
      getPortfolios();
      getRandomNews();
      getRandomStocks();
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated()) {
      Router.push('/');
    }
  }, [user]);

  return (
    <div>
      {isAuthenticated() && (
        <Container maxWidth="lg">
          <Grid container spacing={3} direction={isSmall ? 'column' : 'row'}>
            <Grid item xs={12}>
              <ColorBox>
                <StyledTypography component="h1" variant="h6">
                  Portfolio
                </StyledTypography>
                {portfoliosLoading ? (
                  <>
                    <Card
                      style={{ width: '100%', height: '73px', margin: '16px' }}
                    >
                      <Skeleton variant="rect" height={200} />
                    </Card>
                    <Card
                      style={{ width: '100%', height: '73px', margin: '16px' }}
                    >
                      <Skeleton variant="rect" height={200} />
                    </Card>
                  </>
                ) : (
                  <PortfolioItem m={10} data={portfoliosData} />
                )}
              </ColorBox>
              <CenterBox>
                <CreateGameForm/>
              </CenterBox>
            </Grid>
          </Grid>
        </Container>
      )}
    </div>
  );
};

export default memo(Dashboard);
