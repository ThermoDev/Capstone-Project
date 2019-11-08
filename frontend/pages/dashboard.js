import { useState, useEffect, memo } from 'react';
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
import SearchBar from '../components/SearchBar';

import PortfolioItem from '../components/Portfolio/PortfolioItem';

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

const Dashboard = () => {
  const isSmall = useMediaQuery('(max-width: 600px)');
  const { user, isAuthenticated } = useAuth();
  const { state, getPortfolios, getRandomNews, getRandomStocks } = useApi();
  const { portfolios, news, randomStocks } = state;
  const [searchValue, setSearchValue] = useState('');

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
      if (stocksData.length === 0 || newsData.length === 0) {
        getRandomNews();
        getRandomStocks();
      }
    }
  }, []);

  useEffect(() => {
    if (searchValue) {
      console.log({ searchValue });
    }
  }, [searchValue]);

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
                  <SearchBar placeholder="Search" onSearch={setSearchValue} />
                  {stocksLoading ||
                    (searchValue && (
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
                    stocksData.map(item =>
                      item.Price ? (
                        <Grid item xs={12} key={item.index}>
                          <StockItem
                            name={item.Name}
                            ticker={item.Ticker}
                            price={item.Price}
                            percentageChange={item['PCT Change']}
                          />
                        </Grid>
                      ) : null
                    )}
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
