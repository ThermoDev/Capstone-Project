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
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import get from 'lodash.get';
import useApi from '../../lib/useApi';
import SearchBar from '../SearchBar';
import { InlineError } from '../Error';

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

export default function CreatePortfolioForm(props) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [volume, setVolume] = useState(1);
  const { portfolioName, portfolioId, portfolioCash, symbolData } = props;
  const [value, setValue] = React.useState('Buy');
  const { state, postProcessTransaction, getStock, getPortfolios } = useApi();
  const { processTransaction, stock } = state;


  const transactionData = get(processTransaction, 'data', '');

  const transactionLoading = get(processTransaction, 'isLoading', false);

  const transactionError = get(processTransaction, 'isError', false);

  useEffect(() => {
    if (searchValue) {
      getStock(searchValue);
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
  };

  const handleSubmit = () => {
    if (stock && volume ){
      const price = stock.data[0].Price;
      postProcessTransaction(portfolioId, {
        company_code: searchValue,
        volume,
        price: value === 'Buy' ? price : -1 * price,
      });
      setOpen(false);
      getPortfolios();
    } else {
      
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
                <SearchBar placeholder="Stock" onSearch={setSearchValue} symbolData={symbolData} />
              </SearchBarDiv>
            </div>
            <StyledDiv2>
              <StyledDiv>
                <StyledTextField
                  id="standard-disabled"
                  label="Cash"
                  defaultValue={portfolioCash}
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
                onInput={e => setVolume(e.target.value)}
                fullWidth
              />
            </StyledDiv2>
          </StyledDiv>
          <InlineError error={transactionError}/>

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
};
