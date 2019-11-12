import React from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import useApi from '../../lib/useApi';
import DateFnsUtils from '@date-io/date-fns';
import InputAdornment from '@material-ui/core/InputAdornment';
import Chip from '@material-ui/core/Chip'
import 'date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

const StyledTitle = styled(DialogTitle)`
  padding-bottom: 0px;
`;

const StyledDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;


export default function CreateGameForm() {
  const [state, setState] = React.useState({ open: false, name: '', cash: 0 , date: new Date(), friend:'', friends: []});
  const { postCreateGame } = useApi();
  

  const handleClickOpen = () => {
    setState({ ...state, open: true });
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  const handleTextFieldChange = e => {
    setState({ ...state, [e.target.id]: e.target.value });
  
  };

  const handleCashChange = e => {
    setState({ ...state, cash: e.target.value });
  };

  const handleDateChange = date => {
    setState({ ...state, date});
  };

  const handleAddFriend = () => {
    var newList = state.friends.concat(state.friend);

    setState({ ...state, friends: newList, friend: ''});

  }

  const handleDelete = (val) => {
    var filteredFriends = state.friends.filter(e => e != val.friend)
    setState({ ...state, friends: filteredFriends});
  }

  const handleSubmit = () => {
    const { name, cash, date, friends } = state;

    postCreateGame(name, new Date().toISOString(), date.toISOString(), friends, cash);
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
        <StyledTitle id="form-dialog-title">Create Game</StyledTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="Name"
            fullWidth
            onChange={handleTextFieldChange}
          />
          <StyledDiv>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="dd/MM/yyyy"
                margin="normal"
                id="date-picker-inline"
                label="Date picker inline"
                value={state.date}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
                disablePast={true}
              />
            </MuiPickersUtilsProvider>
            <TextField
              autoFocus
              required
              margin="normal"
              id="cash"
              name="cash"
              label="Starting Budget"
              type="number"
              style={{marginLeft: '15px'}}
              fullWidth
              onChange={handleTextFieldChange}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
          </StyledDiv>
          <StyledDiv>
            <TextField
              autoFocus
              required
              id="friend"
              name="friend"
              label="Friend"
              fullWidth
              value={state.friend}
              onChange={handleTextFieldChange}
            />
            <Button color="primary" variant="contained" onClick={handleAddFriend} >
              <AddIcon/>
            </Button>  
          </StyledDiv>
          <div>
            { state.friends.map((friend, index )=>{
              return(<Chip label={friend} onDelete={handleDelete.bind(this, {friend})} key={index}  />);
            })}
            
          </div>


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
