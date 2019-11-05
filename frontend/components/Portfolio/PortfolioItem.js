import { useState, memo } from 'react';
import PropTypes from 'prop-types';
import {
  ExpansionPanel,
  ExpansionPanelDetails,
  Paper,
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
import TradeStockForm from './TradeStockForm';
import RemoveIcon from '@material-ui/icons/Remove';

// const data = [
//   {
//     portfolio_id: 1,
//     holder: 'janesmith',
//     name: 'p1',
//     cash: 8531.91,
//     amount_invested: 1468.0900000000001,
//     stock_transactions: [
//       {
//         transaction_id: 1,
//         portfolio_id: 1,
//         company_code: 'AAPL',
//         price: 234.4,
//         volume: 2,
//         transaction_time: '2019-10-30T14:33:11.076849',
//       },
//       {
//         transaction_id: 2,
//         portfolio_id: 1,
//         company_code: 'NFLX',
//         price: 218.56,
//         volume: 10,
//         transaction_time: '2019-10-30T14:33:11.076866',
//       },
//       {
//         transaction_id: 3,
//         portfolio_id: 1,
//         company_code: 'AAPL',
//         price: 209.29,
//         volume: 1,
//         transaction_time: '2019-10-30T14:33:11.076869',
//       },
//       {
//         transaction_id: 4,
//         portfolio_id: 1,
//         company_code: 'NFLX',
//         price: 279.12,
//         volume: -5,
//         transaction_time: '2019-10-30T14:33:11.076909',
//       },
//     ],
//     stock_holdings: {
//       AAPL: {
//         company_code: 'AAPL',
//         volume: 3,
//         amount_invested: 678.09,
//         market_value: 729.8699798583984,
//         return_value: 51.779979858398406,
//         percentage_growth: 0.07636151522423042,
//       },
//       NFLX: {
//         company_code: 'NFLX',
//         volume: 5,
//         amount_invested: 790.0,
//         market_value: 1406.0499572753906,
//         return_value: 616.0499572753906,
//         percentage_growth: 0.7798100725004945,
//       },
//     },
//     portfolio_value: 2135.919937133789,
//     portfolio_return: 667.829937133789,
//     percentage_growth: 0.4548971365064737,
//     stock_weightings: {
//       AAPL: 0.4618858516848422,
//       NFLX: 0.5381141483151577,
//     },
//   },
// ];

const ColorBox = styled(Paper)`
  background-color: ${({ theme }) => `${theme.turquoise}`};
  color: white;
  padding: 0.5em 0.75em;
  margin-top: 0.5em;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
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
  const { data } = props;

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
              {item.name}
            </Typography>
            <StyledDiv>
              {item.percentage_growth && (
                <>
                  <Typography component="h1" variant="subtitle1">
                    {`${item.percentage_growth ? item.percentage_growth.toFixed(4): null}%`}
                  </Typography>
                  {item.percentage_growth > 0 ? (
                    <ArrowDropUpIcon color="primary" />
                  ) : (
                    <ArrowDropDownIcon color="error" />
                  )}
                </>
              )}
              <TradeStockForm portfolioName={item.name} portfolioId={item.portfolio_id} portfolioCash={item.cash}/>
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
                  ${item.portfolio_value ?item.portfolio_value.toFixed(2):null}
                </Typography>
                <Typography variant="h5" color="primary">
                  Cash:
                </Typography>
                <Typography variant="h6">${item.cash ? item.cash.toFixed(2): null}</Typography>
              </StyledSubDiv>
              <StyledSubDiv>
                <Doughnut
                  data={{
                    labels: Object.keys(item.stock_value_weightings),
                    datasets: [
                      {
                        data: Object.values(item.stock_value_weightings),
                        backgroundColor: mapLabelToColors(
                          Object.keys(item.stock_value_weightings)
                        ),
                      },
                    ],
                  }}
                />
              </StyledSubDiv>
            </StyledDiv>
            {Object.keys(item.stock_holdings).map((key, index) => {
              const stock = item.stock_holdings[key];
              return (
                <ColorBox key={stock.company_code}>
                  <StyledSubDiv>
                    <StyledTypography variant="h6">
                      {stock.company_code}
                    </StyledTypography>
                    <Typography variant="subtitle2">
                      {stock.volume} share{stock.volume > 1 ? 's' : null}
                    </Typography>
                  </StyledSubDiv>
                  <StyledSubDiv2>
                    <StyledTypography2 variant="h6">
                      ${stock.market_value ? stock.market_value.toFixed(2): null}
                    </StyledTypography2>
                    <StyledTypography variant="subtitle2">
                      {stock.percentage_growth ?stock.percentage_growth.toFixed(4): 0}%
                      {stock.percentage_growth > 0 ? (
                        <ArrowDropUpIcon color="secondary" />
                      ) : ( stock.percentage_growth > 0 ?
                        <ArrowDropDownIcon color="error" />
                        : <RemoveIcon/>
                      )}
                    </StyledTypography>
                  </StyledSubDiv2>
                </ColorBox>
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
};

export default memo(PortfolioItem);
