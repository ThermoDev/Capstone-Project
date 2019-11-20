import { useEffect, memo } from 'react';
import styled from 'styled-components';
import {
  Container,
  Grid,
  useMediaQuery,
  Typography,
  Paper,
  Toolbar,
} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';
import Router from 'next/router';
import get from 'lodash.get';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import useApi from '../lib/useApi';
import { useAuth } from '../lib/useAuth';
import PortfolioItem from '../components/Portfolio/PortfolioItem';
import CreateGameForm from '../components/Game/CreateGameForm';

const ColorBox = styled.div`
  background-color: #00ced1;
  color: white;
  min-height: 5rem;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border-radius: 10px;
  margin: ${({ theme }) => `${theme.mui.spacing(2)}px`} 0;
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

const Play = () => {
  const isSmall = useMediaQuery('(max-width: 600px)');
  const { user, isAuthenticated } = useAuth();
  const { state, getPortfolios, getStockSymbols, getGames } = useApi();
  const { symbols, games } = state;

  // loading variables
  const gamesLoading = get(games, 'isLoading', true);

  // data extraction
  const symbolData = get(symbols, 'data', []);
  const gameData = get(games, 'data', []);

  useEffect(() => {
    if (isAuthenticated()) {
      getPortfolios();
      getStockSymbols();
      getGames();
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated()) {
      Router.push('/');
    }
  }, [user]);

  const gameStillValid = endDate => new Date(endDate) < new Date();

  return (
    <div>
      {isAuthenticated() && (
        <Container maxWidth="lg">
          <Grid container spacing={3} direction={isSmall ? 'column' : 'row'}>
            <Grid item xs={12}>
              <ColorBox style={{ backgroundColor: 'white' }}>
                <Typography
                  variant="h2"
                  color="primary"
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <SportsEsportsIcon fontSize="inherit" /> Games
                </Typography>
              </ColorBox>
              {gamesLoading ? (
                <>
                  <ColorBox>
                    <Paper style={{ backgroundColor: 'white' }}>
                      <Skeleton height={300} variant="rect" />
                    </Paper>
                  </ColorBox>
                </>
              ) : (
                gameData &&
                gameData.map(game => (
                  <ColorBox
                    key={game.game_id}
                    style={
                      gameStillValid(game.end_date)
                        ? { backgroundColor: '#e1e1e1' }
                        : { backgroundColor: '#00ced1' }
                    }
                  >
                    <StyledTypography component="h1" variant="h5">
                      {game.name}
                    </StyledTypography>
                    <Paper style={{ width: '100%', margin: '1em 0' }}>
                      <Toolbar
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          padding: '12px 24px',
                        }}
                      >
                        <div>
                          <Typography color="primary" variant="h5">
                            Leaderboard
                          </Typography>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            width: '100%',
                          }}
                        >
                          <div>
                            <Typography color="primary">
                              Start date:{' '}
                            </Typography>{' '}
                            {new Date(game.start_date).toLocaleDateString()}
                          </div>
                          <div>
                            <Typography color="primary">End date:</Typography>{' '}
                            {new Date(game.end_date).toLocaleDateString()}
                          </div>
                        </div>
                      </Toolbar>
                      <Table aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <StyledTableCell>
                              <Typography color="primary">Rank</Typography>
                            </StyledTableCell>
                            <StyledTableCell align="right">
                              <Typography color="primary">Player</Typography>
                            </StyledTableCell>
                            <StyledTableCell align="right">
                              <Typography color="primary">
                                Portfolio Value
                              </Typography>
                            </StyledTableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {game.leaderboard.map((row, index) => (
                            <TableRow key={index}>
                              <StyledTableCell component="th" scope="row">
                                {index + 1}
                              </StyledTableCell>
                              <StyledTableCell align="right">
                                {row[0]}
                              </StyledTableCell>
                              <StyledTableCell align="right">
                                {row[1]}
                              </StyledTableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Paper>
                    <PortfolioItem
                      m={10}
                      data={game.portfolios}
                      disableTrade={gameStillValid(game.end_date)}
                      symbolData={symbolData}
                      isGame
                    />
                  </ColorBox>
                ))
              )}

              <CenterBox>
                <CreateGameForm />
              </CenterBox>
            </Grid>
          </Grid>
        </Container>
      )}
    </div>
  );
};

export default memo(Play);
