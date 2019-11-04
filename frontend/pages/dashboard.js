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
import CreatePortfolioForm from '../components/Portfolio/CreatePortfolioForm';
import { useAuth } from '../lib/useAuth';
import useApi from '../lib/useApi';
import StockItem from '../components/Stocks';
import NewsItem from '../components/Newsfeed';

import PortfolioItem from '../components/Portfolio/PortfolioItem';

const ColorBox = styled.div`
  background-color: ${({ theme }) => `${theme.lightgrey}`};
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

const Dashboard = () => {
  const isSmall = useMediaQuery('(max-width: 600px)');
  const { user, isAuthenticated } = useAuth();
  const { state, getPortfolios, getRandomNews, getRandomStocks } = useApi();
  const { portfolios, news, randomStocks } = state;

  // loading variables
  const stocksLoading = get(randomStocks, 'isLoading', true);
  const newsLoading = get(news, 'isLoading', true);

  // data extraction
  const stocksData = get(randomStocks, 'data', []);
  const newsData = get(news, 'data.articles', []);

  useEffect(() => {
    getPortfolios();
    getRandomNews();
    getRandomStocks();
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
                <PortfolioItem m={10} />
                <CreatePortfolioForm />
              </ColorBox>
            </Grid>
            <Grid item xs={12} sm={8}>
              <ColorBox>
                <StyledTypography component="h1" variant="h6">
                  Newsfeed
                </StyledTypography>
                <Grid container spacing={1}>
                  {newsLoading ? (
                    <Card style={{ width: '100%', height: '300px' }}>
                      <Skeleton variant="rect" height={200} />
                      <div style={{ padding: '0 0.5rem' }}>
                        <Skeleton />
                        <Skeleton />
                      </div>
                    </Card>
                  ) : (
                    newsData.map((item, idx) => (
                      <Grid item xs={12} key={idx}>
                        <NewsItem item={item} />
                      </Grid>
                    ))
                  )}
                </Grid>
              </ColorBox>
            </Grid>
            <Grid item xs={12} sm={4}>
              <ColorBox>
                <StyledTypography component="h1" variant="h6">
                  Stocks
                </StyledTypography>
                <Grid container spacing={1}>
                  {(stocksLoading && (
                    <Grid item xs={12} align="middle">
                      <Card
                        style={{
                          width: '100%',
                          height: '150px',
                          backgroundColor: '#00ced1',
                        }}
                      >
                        <div style={{ padding: '0 0.5rem' }}>
                          <Skeleton />
                          <Skeleton />
                          <Skeleton />
                        </div>
                      </Card>
                    </Grid>
                  )) ||
                    stocksData.map(item => (
                      <Grid item xs={12} key={item.index}>
                        <StockItem
                          name={item.Name}
                          ticker={item.Ticker}
                          price={item.Price}
                          percentageChange={item['PCT Change']}
                        />
                      </Grid>
                    ))}
                  {/* <Grid item xs={12}>
                    <StockItem
                      key={1}
                      name="Microsoft"
                      ticker="MSFT"
                      price={22.94}
                      percentageChange={2.98}
                    />
                  </Grid> */}
                </Grid>
              </ColorBox>
            </Grid>
          </Grid>
        </Container>
      )}
    </div>
  );
};

export default memo(Dashboard);
