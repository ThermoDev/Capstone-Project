import PropTypes from 'prop-types';
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from '@material-ui/core';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import styled from 'styled-components';

const StockItemCard = styled(Card)`
  background-color: ${({ theme }) => theme.mui.palette.primary.main};
  width: 100%;

  .item {
    display: flex;
    align-items: center;
  }

  .price-box {
    display: flex;
    justify-content: space-between;
  }

  .title {
    color: black;
    font-weight: 600;
  }

  .price {
    color: white;
    font-weight: 600;
    font-size: 1.5rem;
  }

  .percent {
    color: black;
    font-weight: 600;
    font-size: 0.9rem;
  }
`;

export const StockItem = props => {
  const { name, ticker, price, percentageChange } = props;

  if (!price || !percentageChange) return null;

  return (
    <StockItemCard>
      <CardActionArea>
        <CardContent>
          <Typography
            className="title"
            gutterBottom
            variant="h5"
            component="h2"
          >
            {`${name} (${ticker})`}
          </Typography>
          <div className="price-box">
            <div className="item">
              <Typography className="price" variant="h5" component="h2">
                {`$${price}`}
              </Typography>
            </div>
            <div className="item">
              <Typography className="percent" variant="h5" component="h2">
                {`${Math.abs(percentageChange)}%`}
              </Typography>
              {percentageChange > 0 ? (
                <ArrowDropUpIcon style={{ color: 'green' }} />
              ) : (
                <ArrowDropDownIcon style={{ color: 'red' }} />
              )}
            </div>
          </div>
        </CardContent>
      </CardActionArea>
    </StockItemCard>
  );
};

StockItem.propTypes = {
  name: PropTypes.string.isRequired,
  ticker: PropTypes.string.isRequired,
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  percentageChange: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
};
