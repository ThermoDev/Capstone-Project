import React, {useEffect} from 'react';
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
import { useAuth } from '../../lib/useAuth';
import DateFnsUtils from '@date-io/date-fns';
import InputAdornment from '@material-ui/core/InputAdornment';
import Chip from '@material-ui/core/Chip'
import 'date-fns';
import get from 'lodash.get';
import {
  MuiPickersUtilsProvider,
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
  const [values, setValues] = React.useState({ open: false, name: '', cash: 0 , date: new Date(), friend:'', friends: []});
  const [ invalidUser, setInvalidUser] = React.useState(false);
  const { postCreateGame, postCheckUser, state, resetApiData } = useApi();
  const { createGame, checkUser } = state;
  const {  user } = useAuth();

  const userLoading = get(checkUser, 'isLoading', true);

  const userError = get(checkUser, 'isError', false);

  // data extraction
  const userData = get(checkUser, 'data', null);



  useEffect(() => {
    if (userData === true && values.friend !== '' ){
      var newList = values.friends.concat(values.friend);
      setValues({ ...values, friends: newList, friend: ''});
      setInvalidUser(false);

    } else if (userData === false && values.friend !== ''){   
      setInvalidUser(true);
      setValues({ ...values,  friend: ''});

    }
 
    resetApiData(checkUser)
  }, [userLoading]);


  useEffect(() => {
    if (userError) {
      var newList = values.friends.concat(values.friend);
      setValues({ ...values, friends: newList, friend: ''});
    }
  }, [userData]);

  const handleClickOpen = () => {
    setValues({ ...values, open: true });
  };

  const handleClose = () => {
    setValues({ ...values, open: false });
  };

  const handleTextFieldChange = e => {
    setValues({ ...values, [e.target.id]: e.target.value });
  
  };

  const handleCashChange = e => {
    setValues({ ...values, cash: e.target.value });
  };

  const handleDateChange = date => {
    setValues({ ...values, date});
  };

  const handleAddFriend = () => {
    postCheckUser(values.friend);
    
  }

  const handleDelete = (val) => {
    var filteredFriends = values.friends.filter(e => e != val.friend)
    setValues({ ...values, friends: filteredFriends});
  }

  const handleSubmit = () => {
    const { name, cash, date, friends } = values;

    postCreateGame(name, new Date().toISOString(), date.toISOString(), friends, new Number(cash));
    setValues({ ...values, open: false });
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
        open={values.open}
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
                label="End date"
                value={values.date}
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
              value={values.friend}
              onChange={handleTextFieldChange}
              error={invalidUser}
              helperText={invalidUser? 'Unable to find user':''}
            />
            <Button color="primary" variant="contained" onClick={handleAddFriend} >
              <AddIcon/>
            </Button>  
          </StyledDiv>
          <div>
            { values.friends.map((friend, index )=>{
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
