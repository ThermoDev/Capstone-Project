import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  ExpansionPanel,
  ExpansionPanelDetails,
  Card,
  Paper,
  CardActionArea,
  CardContent,
} from '@material-ui/core';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { Doughnut } from 'react-chartjs-2';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import RemoveIcon from '@material-ui/icons/Remove';
import TradeStockForm from './TradeStockForm';
import StockModal from '../StockModal';

const StyledCard = styled(Card)`
  background-color: ${({ theme }) => `${theme.turquoise}`};
  margin-top: 0.5em;
`;

const ColorBox = styled(CardContent)`
  background-color: ${({ theme }) => `${theme.turquoise}`};
  color: white;
  padding: 0.5em 0.75em;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
`;

const StyledDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const StyledSubDiv = styled.div`
  width: 100%;
`;

const StyledSubDiv2 = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-end;
  flex-direction: column;
`;
const StyledPaper = styled(Paper)`
  margin: ${({ theme }) => `${theme.mui.spacing(2)}px`} 0;
  background-color: transparent;
  width: 100%;
`;

const StyledExpansionPanelSummary = styled(ExpansionPanelSummary)`
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
  margin-bottom: -1;
  min-height: 56;
  width: 100%;
  padding: 0;
  .MuiExpansionPanelSummary-content {
    display: flex;
    margin: 0.5em 1em;
    align-items: center;
    justify-content: space-between;
  }
`;

const StyledExpansionPanelDetails = styled(ExpansionPanelDetails)`
  display: flex;
  flex-direction: column;
`;

const StyledTypography = styled(Typography)`
  display: flex;
  align-items: center;
  color: ${({ theme }) => `${theme.black}`};
`;

const StyledTypography2 = styled(Typography)`
  display: flex;
  align-items: center;
  margin-right: 7px;
`;

const mapLabelToColors = labels => {
  const rgb = 1 / labels.length;
  return labels.map(
    (l, index) =>
      `rgb(${255 * rgb * index},${206 + (255 - 206) * rgb * index},${209 +
        (255 - 209) * rgb * index})`
  );
};

const PortfolioItem = props => {
  const [expanded, setExpanded] = useState(null);
  const { data, symbolData, disableTrade, isGame } = props;
  const symbolDict = {};
  if (symbolData) {
    symbolData.forEach(i => {
      symbolDict[i.Ticker] = i;
    });
  }

  const [open, setOpen] = useState('');

  const handleOpen = code => {
    setOpen(code);
  };

  const handleClose = () => setOpen('');

  const handleChange = val => {
    if (expanded === val) {
      setExpanded(null);
    } else {
      setExpanded(val);
    }
  };

  return (
    <StyledPaper>
      {data.map(item => (
        <ExpansionPanel
          expanded={expanded === item.portfolio_id}
          key={item.portfolio_id}
        >
          <StyledExpansionPanelSummary
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography component="h1" variant="h4">
              {isGame ? <div>{item.holder}'s Portfolio</div> : item.name}
            </Typography>
            <StyledDiv>
              {item.percentage_growth !== 0 && (
                <>
                  <Typography component="h1" variant="subtitle1">
                    {`${
                      item.percentage_growth
                        ? item.percentage_growth.toFixed(4)
                        : null
                    }%`}
                  </Typography>
                  {// eslint-disable-next-line no-nested-ternary
                  item.percentage_growth > 0 ? (
                    <ArrowDropUpIcon color="primary" />
                  ) : item.percentage_growth < 0 ? (
                    <ArrowDropDownIcon color="error" />
                  ) : (
                    <RemoveIcon />
                  )}
                </>
              )}
              {!disableTrade ? (
                <TradeStockForm
                  portfolioName={item.name}
                  portfolioId={item.portfolio_id}
                  portfolioCash={item.cash}
                  symbolData={symbolData}
                  stocks={item.stock_holdings}
                />
              ) : null}

              <IconButton onClick={() => handleChange(item.portfolio_id)}>
                {expanded === item.portfolio_id ? (
                  <ExpandLessIcon />
                ) : (
                  <ExpandMoreIcon />
                )}
              </IconButton>
            </StyledDiv>
          </StyledExpansionPanelSummary>
          <StyledExpansionPanelDetails>
            <StyledDiv>
              <StyledSubDiv>
                <Typography variant="h5" color="primary">
                  Portfolio value:
                </Typography>
                <Typography variant="h6">
                  $
                  {item.portfolio_value
                    ? item.portfolio_value.toFixed(2)
                    : null}
                </Typography>
                <Typography variant="h5" color="primary">
                  Cash:
                </Typography>
                <Typography variant="h6">
                  ${item.cash ? item.cash.toFixed(2) : null}
                </Typography>
              </StyledSubDiv>
              <StyledSubDiv>
                {JSON.stringify(item.stock_weightings) !== '{}' ? (
                  <Doughnut
                    data={{
                      labels: Object.keys(item.stock_weightings),
                      datasets: [
                        {
                          data: Object.values(item.stock_weightings),
                          backgroundColor: mapLabelToColors(
                            Object.keys(item.stock_weightings)
                          ),
                        },
                      ],
                    }}
                  />
                ) : (
                  <Typography color="error">
                    Click 'Trade' to see more!
                  </Typography>
                )}
              </StyledSubDiv>
            </StyledDiv>
            {Object.keys(item.stock_holdings).map(key => {
              const stock = item.stock_holdings[key];
              return (
                <div key={stock.company_code}>
                  <StyledCard>
                    <CardActionArea
                      onClick={() => handleOpen(stock.company_code)}
                    >
                      <ColorBox>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start',
                            width: '100%',
                          }}
                        >
                          <StyledSubDiv>
                            <StyledTypography variant="h6">
                              {symbolDict && symbolDict[stock.company_code]
                                ? symbolDict[stock.company_code].Name
                                : ''}
                              ({stock.company_code})
                            </StyledTypography>
                            <Typography variant="subtitle2">
                              {stock.volume} share
                              {stock.volume > 1 ? 's' : null}
                            </Typography>
                            <Typography color="secondary">
                              {symbolDict && symbolDict[stock.company_code]
                                ? symbolDict[stock.company_code].Industry
                                : ''}
                            </Typography>
                          </StyledSubDiv>
                          <StyledSubDiv2>
                            <StyledTypography2 variant="h6">
                              $
                              {stock.market_value
                                ? stock.market_value.toFixed(2)
                                : null}
                            </StyledTypography2>
                            <StyledTypography variant="subtitle2">
                              {stock.percentage_growth
                                ? stock.percentage_growth.toFixed(4)
                                : 0}
                              %
                              {// eslint-disable-next-line no-nested-ternary
                              stock.percentage_growth > 0 ? (
                                <ArrowDropUpIcon color="secondary" />
                              ) : stock.percentage_growth < 0 ? (
                                <ArrowDropDownIcon color="error" />
                              ) : (
                                <RemoveIcon />
                              )}
                            </StyledTypography>
                          </StyledSubDiv2>
                        </div>
                      </ColorBox>
                    </CardActionArea>
                  </StyledCard>
                  <StockModal
                    open={open === stock.company_code}
                    handleClose={handleClose}
                    name={
                      symbolDict && symbolDict[stock.company_code]
                        ? symbolDict[stock.company_code].Name
                        : ''
                    }
                    ticker={stock.company_code}
                  />
                </div>
              );
            })}
          </StyledExpansionPanelDetails>
        </ExpansionPanel>
      ))}
    </StyledPaper>
  );
};

PortfolioItem.propTypes = {
  data: PropTypes.array.isRequired,
  symbolData: PropTypes.array.isRequired,
  disableTrade: PropTypes.bool,
  isGame: PropTypes.bool,
};

export default PortfolioItem;
