import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import Tooltip from '@material-ui/core/Tooltip';
import InfoIcon from '@material-ui/icons/Info';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import get from 'lodash.get';
import useApi from '../../lib/useApi';
import SearchBar from '../SearchBar';
import { InlineError } from '../Error';

/*
  Trade Stock Form

  Component Type: Dialog Box, triggered by button

  Description:
  - Form for users to fill in trade details
  - Contains error handling


*/

const ColorBox = styled(Paper)`
  background-color: ${({ theme }) => `${theme.turquoise}`};
  color: white;
  display: flex;
  justify-content: start;
  align-items: center;
  flex-direction: row;
  width: 100%;
  height: 5rem;
  margin: 8px 16px;
  padding: ${({ theme }) => `${theme.mui.spacing(4)}px`};
`;

const StyledTitle = styled(DialogTitle)`
  padding-bottom: 0px;
`;

const StyledButton = styled(Button)`
  margin: 0 ${({ theme }) => `${theme.mui.spacing(1)}px`};
  display: flex;
  justify-content: space-between;
`;

const StyledDiv = styled.div`
  display: flex;
  flex-direction: row;
`;

const StyledDiv2 = styled.div`
  width: 100%;
`;

const StyledTextField = styled(TextField)`
  margin-right: ${({ theme }) => `${theme.mui.spacing(2)}px`};
`;

const StyledFormControl = styled(FormControl)`
  width: 100%;
`;

const SearchBarDiv = styled.div`
  margin-top: 16px;
  margin-bottom: 8px;
  margin-right: 16px;
`;

const StyledHtmlTooltip = styled(Tooltip)`
  tooltip: {
    background-color: #f5f5f9,
    color: rgba(0, 0, 0, 0.87),
    max-width: 220,
    border: 1px solid #dadde9,
  },
`;

export default function CreatePortfolioForm(props) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [volume, setVolume] = useState(1);
  const {
    portfolioName,
    portfolioId,
    portfolioCash,
    symbolData,
    stocks,
  } = props;
  const [value, setValue] = React.useState('Buy');
  const [error, setError] = useState('');
  const { state, postProcessTransaction, getStock } = useApi();
  const { processTransaction, stock } = state;


  const transactionError = get(processTransaction, 'isError', false);

  useEffect(() => {
    if (searchValue) {
      getStock(searchValue);
      setError('');
    }
  }, [searchValue]);

  useEffect(() => {
    if (searchValue) {
      getStock(searchValue);
    }
  }, [transactionError]);

  const handleChange = event => {
    setValue(event.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setVolume(1);
    setSearchValue('');
    setError('');
  };

  const handleSubmit = () => {
    if (!stock) {
      setError('Please select a stock');
      return;
    }

    if (!volume) {
      setError('Please enter a volume');
      return;
    }

    const price = stock.data[0].Price;
    if (price * volume > portfolioCash && value === 'Buy') {
      setError('Insufficient funds');
      // Handle if insufficient cash
    } else if (
      value === 'Sell' &&
      volume > stocks[stock.data[0].Ticker].volume
    ) {
      setError('Insufficient stocks');
    } else if (stock && volume) {
      postProcessTransaction(portfolioId, {
        company_code: searchValue,
        volume: value === 'Buy' ? volume : -1 * volume,
        price,
      });
      setOpen(false);
    }
  };

  return (
    <div>
      <StyledButton
        variant="outlined"
        color="primary"
        onClick={handleClickOpen}
      >
        Trade
        <StyledHtmlTooltip
                  title={
                    <>
                      <Typography color="inherit">Trade</Typography>
                      
                      <em>essential</em>
                      {
                        'To get your portfolio started, click trade to buy or sell stocks. '
                      }
                      {
                        'You can search what stock you want and look at the prices before you buy!'
                      }

                    </>
                  }
                >
                  <InfoIcon />
                </StyledHtmlTooltip>
      </StyledButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <StyledTitle id="form-dialog-title">Trade</StyledTitle>
        <DialogContent>
          <StyledDiv>
            <div>
              <StyledTextField
                disabled
                id="standard-disabled"
                label="Portfolio"
                defaultValue={portfolioName}
                margin="normal"
              />
              <SearchBarDiv>
                <SearchBar
                  placeholder="Stock"
                  onSearch={setSearchValue}
                  symbolData={
                    value === 'Buy'
                      ? symbolData
                      : symbolData.filter(
                          i => Object.keys(stocks).indexOf(i.Ticker) > -1
                        )
                  }
                />
              </SearchBarDiv>
            </div>
            <StyledDiv2>
              <StyledDiv>
                <StyledTextField
                  id="standard-disabled"
                  label="Cash"
                  defaultValue={portfolioCash.toFixed(2)}
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                  disabled
                />
                <StyledFormControl required margin="normal">
                  <InputLabel id="demo-simple-select-required-label">
                    Action
                  </InputLabel>
                  <Select
                    labelid="demo-simple-select-required-label"
                    id="demo-simple-select-required"
                    value={value}
                    onChange={handleChange}
                  >
                    <MenuItem value="Buy">Buy</MenuItem>
                    <MenuItem value="Sell">Sell</MenuItem>
                  </Select>
                </StyledFormControl>
              </StyledDiv>
              <StyledTextField
                id="outlined"
                label="Volume"
                margin="normal"
                type="number"
                value={volume}
                onInput={e => {
                  setVolume(e.target.value);
                  setError('');
                }}
                fullWidth
              />
            </StyledDiv2>
          </StyledDiv>
          {transactionError && (
            <InlineError error={{ errMessage: error, errType: 'Trade' }} />
          )}
        </DialogContent>
        <DialogActions>
          <ColorBox>
            {(stock && stock.isLoading && (
              <Typography variant="h5">Grabbing latest prices...</Typography>
            )) ||
              (stock && stock.data && searchValue && (
                <Typography variant="h5">
                  {`Total: $${(stock.data[0].Price * volume).toFixed(2)}`}
                </Typography>
              )) || <Typography variant="h5">Total: $0.00</Typography>}
          </ColorBox>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Trade
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

CreatePortfolioForm.propTypes = {
  portfolioName: PropTypes.string.isRequired,
  portfolioId: PropTypes.number.isRequired,
  portfolioCash: PropTypes.number.isRequired,
  symbolData: PropTypes.array.isRequired,
  stocks: PropTypes.object.isRequired,
};
