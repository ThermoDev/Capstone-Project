import { useEffect, memo } from 'react';
import styled from 'styled-components';
import {
  Container,
  Grid,
  useMediaQuery,
  Typography,
  Paper,
  Card,
  Toolbar
} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import Divider from '@material-ui/core/Divider';
import Router from 'next/router';
import get from 'lodash.get';
import { useAuth } from '../lib/useAuth';
import useApi from '../lib/useApi';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
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

const StyledTableCell = styled(TableCell)`
  padding: 16px 24px;
`;

const CenterBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const gameData = [{
	"game_id": 1,
	"name": "It's a game!",
	"start_date": "2019-11-10T10:00:00.007Z",
	"end_date": "2019-11-20T10:00:00.007Z",
	"users": ["ant", "em"],
	"portfolios": [
	],
	"leaderboard": [
		["ant", 1000],
		["em", 1000]
	]
}];

const Dashboard = () => {
  const isSmall = useMediaQuery('(max-width: 600px)');
  const { user, isAuthenticated } = useAuth();
  const { state, getPortfolios, getStockSymbols} = useApi();
  const { portfolios, news, randomStocks, symbols } = state;

  // loading variables
  const portfoliosLoading = get(portfolios, 'isLoading', true);

  // data extraction
  const portfoliosData = get(portfolios, 'data', []);
  const symbolData = get(symbols, 'data', []);


  useEffect(() => {
    if (isAuthenticated()) {
      getPortfolios();
      getStockSymbols();

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

              {gameData.map((game) => {
                return(<ColorBox key={game.game_id}>
                <StyledTypography component="h1" variant="h5">
                  {game.name}
                </StyledTypography>
                <Paper style={{width: "100%", margin: "1em 0"}}>
                  <Toolbar style={{display: "flex", flexDirection: "column", padding: "12px 24px"}}>
                    <div>
                      <Typography color="primary" variant="h5">Leaderboard</Typography>
                    </div>
                    <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%"}}>
                      <div>
                        <Typography color="primary">Start date: </Typography> {new Date(game.start_date).toLocaleDateString()}
                      </div>
                      <div>
                        <Typography color="primary">End date:</Typography> {new Date(game.end_date).toLocaleDateString()}
                      </div>
                    </div>
                  </Toolbar>
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell><Typography color="primary">Rank</Typography></StyledTableCell>
                        <StyledTableCell align="right"><Typography color="primary">Player</Typography></StyledTableCell>
                        <StyledTableCell align="right"><Typography color="primary">Portfolio Value</Typography></StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {game.leaderboard.map((row, index) => (
                        <TableRow key={index}>
                        <StyledTableCell component="th" scope="row">
                          {index+1}
                        </StyledTableCell>
                        <StyledTableCell align="right">{row[0]}</StyledTableCell>
                        <StyledTableCell align="right">{row[1]}</StyledTableCell>
                      </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
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
                  <PortfolioItem m={10} data={portfoliosData} disableTrade={new Date(game.end_date) < new Date() } symbolData={symbolData}/>
                  
                )}
              </ColorBox>
              );})}              

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
