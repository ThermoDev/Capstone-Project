import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import InputAdornment from '@material-ui/core/InputAdornment';
import LinearProgress from '@material-ui/core/LinearProgress';
import useApi from '../../lib/useApi';
import { InlineError } from '../Error';

/*
  Create Portfolio Form

  Component Type: Form

  Description:
  - Allows users to enter details to create a form
  - Has error handling

*/

const StyledTitle = styled(DialogTitle)`
  padding-bottom: 0px;
`;

export default function CreatePortfolioForm() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', cash: 0 });
  const { state, createPortfolio, resetApiData } = useApi();
  const { createPort } = state;

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    // resets isError inside of createPort because the normal behaviour is to persist state between pages
    resetApiData('createPort');
    // reset form values
    setForm({ name: '', cash: 0 });
  };

  const handleTextFieldChange = e => {
    setForm({
      ...form,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = () => {
    const { name, cash } = form;
    createPortfolio(name, cash);
  };

  // We can close the dialogue box if !createPort.isError and if createPort.data !== undefined
  // Ie. we made a successful request, received a the correct response without any errors
  useEffect(() => {
    if (createPort && !createPort.isError && !!createPort.data) {
      // if we have successfully created a new portfolio, close the dialogue box
      setOpen(false);
    }
  }, [createPort]);

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
        open={open}
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
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
          />
          {// Display a loading bar while the api is being called
          createPort && createPort.isLoading && (
            <DialogContent>
              <LinearProgress variant="query" />
            </DialogContent>
          )}
          {// Display an error message if the api call fails (error thrown from backend)
          createPort && createPort.isError && (
            <InlineError error={createPort.error} />
          )}
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
