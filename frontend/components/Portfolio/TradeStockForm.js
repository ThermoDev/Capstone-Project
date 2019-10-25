import React from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

const StyledTitle = styled(DialogTitle)`
  padding-bottom: 0px ;
`;

const StyledButton = styled(Button)`
  margin: 0 ${({ theme }) => `${theme.mui.spacing(1)}px`};
`;


export default function CreatePortfolioForm() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <StyledButton variant="contained" color="primary" onClick={handleClickOpen}>Trade</StyledButton>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <StyledTitle id="form-dialog-title">Create Portfolio</StyledTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            label="Portfolio Name"
            fullWidth
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            label="Starting Budget"
            type="number"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}