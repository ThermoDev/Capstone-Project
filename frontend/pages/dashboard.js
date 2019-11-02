import { useEffect, memo } from 'react';
import styled from 'styled-components';
import {
  Container,
  Grid,
  useMediaQuery,
  Typography,
  CircularProgress,
} from '@material-ui/core';
import Router from 'next/router';
import CreatePortfolioForm from '../components/Portfolio/CreatePortfolioForm';
import { useAuth } from '../lib/useAuth';
import useApi from '../lib/useApi';
import { StockItem } from '../components/Stocks';

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
  const { portfoliosApi, getRandomStocksApi } = useApi();
  const { portfolios, getPortfolios } = portfoliosApi();
  const { result, getRandom } = getRandomStocksApi();

  useEffect(() => {
    getPortfolios(); // call this only once on mount
    // getRandom();
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
              </ColorBox>
            </Grid>
            <Grid item xs={12} sm={4}>
              <ColorBox>
                <StyledTypography component="h1" variant="h6">
                  Stocks
                </StyledTypography>
                {result.isLoading && (
                  <Grid item>
                    <CircularProgress />
                  </Grid>
                )}
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <StockItem
                      key={1}
                      name="Microsoft"
                      ticker="MSFT"
                      price={22.94}
                      percentageChange={2.98}
                    />
                  </Grid>
                  {/* {result.data.map(item => (
                    <Grid item xs={12}>
                      <StockItem
                        key={item.index}
                        name={item.Name}
                        ticker={item.Ticker}
                        price={item.Price.toFixed(2)}
                        percentageChange={item['PCT Change'].toFixed(2)}
                      />
                    </Grid>
                  ))} */}
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
