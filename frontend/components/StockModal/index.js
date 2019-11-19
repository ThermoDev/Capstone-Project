import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  Modal,
  Backdrop,
  Fade,
  Paper,
  Typography,
  Button,
  ButtonGroup,
  Grid,
} from '@material-ui/core';
import get from 'lodash.get';
import moment from 'moment';
import { Line } from '../Graph';
import useApi from '../../lib/useApi';

const ModalContainer = styled(Paper)`
  background-color: ${({ theme }) => theme.mui.palette.background.paper};
  border: 2px solid #000;
  box-shadow: ${({ theme }) => theme.mui.shadows[5]};
  padding: ${({ theme }) => theme.mui.spacing(2, 4, 3)};
  max-width: 800px;
`;

const StockModal = props => {
  const { open, handleClose, name, ticker } = props;
  const [filter, setFilter] = useState('All');
  const [xLabels, setXLabels] = useState([]);
  const [dataPoints, setDataPoints] = useState([]);
  const { state, getYearlyStockHistory } = useApi();
  const { stockHistory } = state;

  // loading variable
  const stocksLoading = get(stockHistory, 'isLoading', true);

  // data extraction
  const stocksData = get(stockHistory, 'data', {});

  const filterData = filterOption => {
    let limit = null;

    const filtered = rawObj => {
      const newObj = Object.keys(rawObj).filter(key => key >= limit);
      setXLabels(newObj.map(i => (new Date(i*1).toLocaleDateString())));
      const filteredData = newObj.reduce(
        (obj, key) => ({ ...obj, [key]: stocksData[key] }),
        {}
      );
      return Object.values(filteredData).map(item => item.Close);
    };
    switch (filterOption) {
      case 'Weekly':
        limit = moment()
          .add(-1, 'week')
          .format('x');
        setDataPoints(filtered(stocksData));
        break;
      case 'Quarterly':
        limit = moment()
          .add(-3, 'month')
          .format('x');
        setDataPoints(filtered(stocksData));
        break;
      case 'Biannual':
        limit = moment()
          .add(-6, 'month')
          .format('x');
        setDataPoints(filtered(stocksData));
        break;
      case 'Annual':
        limit = moment()
          .add(-1, 'year')
          .format('x');
        setDataPoints(filtered(stocksData));

        break;
      case 'All':
        setXLabels(Object.keys(stocksData).filter(key => key >= limit).map(i => (new Date(i*1).toLocaleDateString())));
        setDataPoints(Object.values(stocksData).map(item => item.Close));
        break;
      default:
    }
  };

  useEffect(() => {
    if (open) {
      getYearlyStockHistory(ticker);
    }
  }, [open]);

  useEffect(() => {
    if (open && !stocksLoading) {
      filterData(filter);
    }
  }, [filter, stocksLoading]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Fade in={open}>
        <ModalContainer>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography
                className="title"
                gutterBottom
                variant="h5"
                component="h2"
              >
                {`${name} (${ticker})`}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Line
                dataLabel={ticker}
                xLabels={xLabels}
                dataPoints={dataPoints}
                loading={stocksLoading}
              />
            </Grid>
            <Grid item xs={12}>
              <ButtonGroup
                fullWidth
                aria-label="full width outlined button group"
              >
                <Button onClick={() => setFilter('Weekly')}>1 week</Button>
                <Button onClick={() => setFilter('Quarterly')}>3 Months</Button>
                <Button onClick={() => setFilter('Biannual')}>6 Months</Button>
                <Button onClick={() => setFilter('Annual')}>1 Year</Button>
                <Button onClick={() => setFilter('All')}>5 Years</Button>
              </ButtonGroup>
            </Grid>
          </Grid>
        </ModalContainer>
      </Fade>
    </Modal>
  );
};

StockModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  ticker: PropTypes.string.isRequired,
};

export default StockModal;
