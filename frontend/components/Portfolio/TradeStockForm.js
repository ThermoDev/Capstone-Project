import React from 'react';
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
import useApi from '../../lib/useApi';
import get from 'lodash.get';

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

const StyledTextField = styled(TextField)`
  margin-right:${({ theme }) => `${theme.mui.spacing(2)}px`};
`;

export default function CreatePortfolioForm(props) {
  const [open, setOpen] = React.useState(false);
  const {portfolioName, portfolioId, portfolioCash} = props;
  const [value, setValue] = React.useState("Buy");
  const { state, postProcessTransaction } = useApi();
  const { processTransaction } = state;
  const processError = get(processTransaction, 'isError', true);

  const handleChange = event => {
    setValue(event.target.value);
  };


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    postProcessTransaction(portfolioId, {
      company_code:'A',
      volume: 2,
      price: 10
    });
  }

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
      <StyledTitle id="form-dialog-title">Create Portfolio</StyledTitle>
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

            </div>
            <div>       
              <StyledDiv>
                <StyledTextField
                    id="standard-disabled"
                    label="Cash"
                    defaultValue={portfolioCash}
                    margin="normal"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    disabled
                  />
                <FormControl required margin="normal">
                  <InputLabel id="demo-simple-select-required-label">Action</InputLabel>
                  <Select
                    labelid="demo-simple-select-required-label"
                    id="demo-simple-select-required"
                    value={value}
                    onChange={handleChange}
                  >
                    <MenuItem value={"Buy"}>Buy</MenuItem>
                    <MenuItem value={"Sell"}>Sell</MenuItem>
                  </Select>
                </FormControl>
              </StyledDiv>
              <StyledTextField
                    id="outlined"
                    label="Volume"
                    margin="normal"
                    fullWidth 
              />
            </div> 
          </StyledDiv>
        <div></div>


        </DialogContent>
        <DialogActions>
          <ColorBox>
            <Typography variant="h5">Total:</Typography>
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
