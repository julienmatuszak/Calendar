import React from 'react';
import { Dialog, DialogActions, DialogTitle } from '@mui/material';
import StyledConfirmButton from '../../../components/styledConfirmButton/StyledConfirmButton';
import StyledDeclineButton from '../../../components/styledDeclineButton/StyledDeclineButton';

export function ConfirmationAlert({
  open,
  onClose,
  approveSave,
}: {
  open: boolean;
  onClose: any;
  approveSave: () => void;
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle
        id="alert-dialog-title"
        sx={{
          fontFamily: 'Poppins',
          fontWeight: 600,
          fontSize: 16,
          lineHeight: '24px',
          letterSpacing: '0.15px',
          color: 'rgba(0, 0, 0, 0.87)',
        }}
      >
        {'Do you want to save changes?'}
      </DialogTitle>
      <DialogActions>
        <StyledDeclineButton
          onClick={onClose}
          sx={{
            margin: '0px 10px 8px 0px',
          }}
        >
          NO
        </StyledDeclineButton>
        <StyledConfirmButton
          onClick={approveSave}
          autoFocus
          sx={{
            margin: '0px 10px 8px 8px',
          }}
        >
          YES
        </StyledConfirmButton>
      </DialogActions>
    </Dialog>
  );
}
