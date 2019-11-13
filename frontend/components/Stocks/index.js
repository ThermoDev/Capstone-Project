import { useState, memo } from 'react';
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
import StockModal from '../StockModal';

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

const StockItem = props => {
  const { name, ticker, price, percentageChange, industry } = props;
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  if (!price || !percentageChange) return null;

  return (
    <>
      <StockItemCard>
        <CardActionArea onClick={handleOpen}>
          <CardContent>
            <Typography
              className="title"
              gutterBottom
              variant="h5"
              component="h2"
            >
              {`${name} (${ticker})`}
            </Typography>
            <Typography color="secondary" variant="subtitle" component="h2">{industry}</Typography>
            <div className="price-box">
              <div className="item">
                <Typography className="price" variant="h5" component="h2">
                  {`$${price.toFixed(2)}`}
                </Typography>
              </div>
              
              <div className="item">
                <Typography className="percent" variant="h5" component="h2">
                  {`${Math.abs(percentageChange.toFixed(2))}%`}
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
      <StockModal
        open={open}
        handleClose={handleClose}
        name={name}
        ticker={ticker}
      />
    </>
  );
};

StockItem.propTypes = {
  name: PropTypes.string.isRequired,
  ticker: PropTypes.string.isRequired,
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  percentageChange: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
};

export default memo(StockItem);
