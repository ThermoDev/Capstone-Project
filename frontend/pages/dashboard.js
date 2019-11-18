import { useState, useEffect, memo } from 'react';
import styled from 'styled-components';
import {
  Container,
  Grid,
  useMediaQuery,
  Typography,
  Card,
  Paper,
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
  const { user, isAuthenticated, isLoading } = useAuth();
  const {
    state,
    getPortfolios,
    getRandomNews,
    getRandomStocks,
    getStockInfo,
    getStockSymbols,
  } = useApi();
  const { portfolios, news, randomStocks, stockInfo, symbols} = state;
  const [searchValue, setSearchValue] = useState('');


  // loading variables
  const portfoliosLoading = get(portfolios, 'isLoading', true);
  const stocksLoading = get(randomStocks, 'isLoading', true);
  const newsLoading = get(news, 'isLoading', true);
  const infoLoading = get(stockInfo, 'isLoading', false);

  // error variables
  const portfoliosError = get(portfolios, 'isError', false);
  const stocksError = get(randomStocks, 'isError', false);
  const infoError = get(stockInfo, 'isError', false);

  // data extraction
  const portfoliosData = get(portfolios, 'data', []);
  const stocksData = get(randomStocks, 'data', []);
  const newsData = get(news, 'data.articles', []);
  const singularStockData = get(stockInfo, 'data', {});
  const symbolData = get(symbols, 'data', []);


  useEffect(() => {
    if (isAuthenticated()) {
      getPortfolios();
      getStockSymbols();
      if (stocksData.length === 0 || newsData.length === 0) {
        getRandomNews();
        getRandomStocks();
      }
    }
  }, []);


  useEffect(() => {
    if (searchValue) {
      getStockInfo(searchValue);
    }
  }, [searchValue]);

  useEffect(() => {
    if (!isAuthenticated()) {
      Router.push('/');
    }
  }, [user]);

  const stockSearchRender = () => {

    if (stocksLoading || infoLoading) {
      return (
        <Grid item xs={12} align="middle">
          <Card
            style={{
              width: '100%',
              height: '150px',
              backgroundColor: '#00ced1',
            }}
          >
            <div style={{ padding: '0 0.5rem' }}>
              <Skeleton height={50} />
              <Skeleton />
            </div>
          </Card>
        </Grid>
      );
    }
    if (searchValue && infoError) {
      return (
        <Grid item xs={12} align="middle">
          <Card
            style={{
              width: '100%',
              height: '150px',
              backgroundColor: '#00ced1',
            }}
          >
            <div style={{ padding: '0 0.5rem' }}>
              <p>Could not load data from server.</p>
            </div>
          </Card>
        </Grid>
      );
    }


    if (searchValue && singularStockData.length ) {

      return (
        <Grid item xs={12}>
          <StockItem
            name={singularStockData[0].Name}
            ticker={singularStockData[0].Ticker}
            price={singularStockData[0].Price}
            percentageChange={singularStockData[0]['PCT Change']}
          />
        </Grid>
      );
    }
    if (stocksError) {
      return (
        <Grid item xs={12} align="middle">
          <Card
            style={{
              width: '100%',
              height: '150px',
              backgroundColor: '#00ced1',
            }}
          >
            <div style={{ padding: '0 0.5rem' }}>
              <p>Could not load data from server.</p>
            </div>
          </Card>
        </Grid>
      );
    }
    return stocksData.map(item =>
      item.Price ? (
        <Grid item xs={12} key={item.index}>
          <StockItem
            name={item.Name}
            ticker={item.Ticker}
            price={item.Price}
            industry={item.Industry}
            percentageChange={item['PCT Change']}
          />
        </Grid>
      ) : null
    );
  };

  return (
    <div>
      { isLoading ? <div></div> :
      (isAuthenticated() && (
        <Container maxWidth="lg">
          <Grid container spacing={3} direction={isSmall ? 'column' : 'row'}>
            <Grid item xs={12}>
              <ColorBox>
                <StyledTypography component="h1" variant="h6">
                  Portfolio
                </StyledTypography>
                {portfoliosError && (
                  <div>
                    <p>{`Error: ${portfolios.error.message}`}</p>
                  </div>
                )}
                {portfoliosLoading ? (
                  <>
                    <Card
                      style={{ width: '100%', height: '73px', margin: '16px' }}
                    >
                      <Skeleton variant="rect" height={300} />
                    </Card>
                  </>
                ) : (
                  <PortfolioItem m={10} data={portfoliosData} symbolData={symbolData} />
                )}
                <CreatePortfolioForm />
              </ColorBox>
            </Grid>
            <Grid item xs={12} sm={8}>
              <ColorBox>
                <StyledTypography component="h1" variant="h6">
                  Newsfeed
                </StyledTypography>
                <Grid
                  container
                  spacing={1}
                  style={{ height: 500, overflowY: 'scroll' }}
                >
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
                  <Grid item xs={12}>
                    <SearchBar placeholder="Search" onSearch={setSearchValue} symbolData={symbolData}/>
                  </Grid>
                  <Grid
                    item
                    container
                    spacing={1}
                    style={{ height: 440, overflowY: 'scroll' }}
                  >
                    {stockSearchRender()}
                  </Grid>
                </Grid>
              </ColorBox>
            </Grid>
          </Grid>
        </Container>
      ))
    }
    </div>
  );
};

export default Dashboard;
