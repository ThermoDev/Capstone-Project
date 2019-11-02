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
import { Line } from '../Graph';

const ModalContainer = styled(Paper)`
  background-color: ${({ theme }) => theme.mui.palette.background.paper};
  border: 2px solid #000;
  box-shadow: ${({ theme }) => theme.mui.shadows[5]};
  padding: ${({ theme }) => theme.mui.spacing(2, 4, 3)};
  max-width: 800px;
`;

const StockModal = props => {
  const { open, handleClose, title } = props;
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
                {title}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Line />
            </Grid>
            <Grid item xs={12}>
              <ButtonGroup
                fullWidth
                aria-label="full width outlined button group"
              >
                <Button>1 week</Button>
                <Button>1 Month</Button>
                <Button>6 Months</Button>
                <Button>1 Year</Button>
                <Button>All</Button>
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
  title: PropTypes.string.isRequired,
};

export default StockModal;
