import React,  { useEffect } from 'react';
import useApi from '../../lib/useApi';
import { useAuth } from '../../lib/useAuth';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';



const StyledTitle = styled(DialogTitle)`
  padding-bottom: 0px;
`;

export default function CreatePortfolioForm() {
  const [state, setState] = React.useState({open:false, name:'', cash:0});
  const { createPortfolioApi } = useApi();
  const { createState, createPortfolio } = createPortfolioApi();
 
  const handleClickOpen = () => {
    setState({ ...state, open: true });
    console.log(state)
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  const handleTextFieldChange= (e) =>{
    console.log(e.target.id);
    setState({ ...state, [e.target.id] :e.target.value });
  };

  const handleCashChange= (e) =>{
    setState({ ...state, cash :e.target.value });
  };

  const handleSubmit = () => {
    const name = state.name;
    const cash = state.cash;

    createPortfolio(name, cash);
    setState({ ...state, open: false });
  };

  return (
    <div>
      <Fab
        color="primary"
        aria-label="add"
        size="small"
        onClick={handleClickOpen}
      >
        <AddIcon />
      </Fab>
      <Dialog
        open={state.open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <StyledTitle id="form-dialog-title">Create Portfolio</StyledTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="Portfolio Name"
            fullWidth
            onChange={handleTextFieldChange}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="cash"
            name="cash"
            label="Starting Budget"
            type="number"
            fullWidth
            onChange={handleTextFieldChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
