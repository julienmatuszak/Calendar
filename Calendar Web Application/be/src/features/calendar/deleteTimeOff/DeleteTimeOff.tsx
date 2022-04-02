import React from 'react';
import { Box, Dialog, DialogTitle } from '@mui/material';
import { useAppDispatch } from '../../../app/hooks';
import { deleteTimeOff } from '../calendarSlice';
import StyledDeclineButton from '../../../components/styledDeclineButton/StyledDeclineButton';
import StyledConfirmButton from '../../../components/styledConfirmButton/StyledConfirmButton';

export default function DeleteTimeOff({
  open,
  onClose,
  idSelected,
  setItemSelected,
}: {
  open: boolean;
  onClose: any;
  idSelected: number;
  setItemSelected: any;
}) {
  const dispatch = useAppDispatch();

  const stopPropagation = function (e: any) {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };

  const handleConfirmDelete = (e: any) => {
    stopPropagation(e);
    dispatch(deleteTimeOff(idSelected));
    onClose();
  };

  const handleClose = (e: any) => {
    stopPropagation(e);
    setItemSelected(null);
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle
        sx={{
          overflowY: 'hidden',
          fontFamily: 'Poppins',
          fontStyle: 'normal',
          fontWeight: 600,
          fontSize: '16px',
          lineHeight: '24px',
          letterSpacing: '0.15px',
          color: 'rgba(0, 0, 0, 0.87)',
          flex: 'none',
          order: 0,
          alignSelf: 'stretch',
          flexGrow: 0,
          margin: '15px 0px',
        }}
      >
        Are you sure you want to delete this time off ?
      </DialogTitle>
      <Box
        sx={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          float: 'right',
        }}
      >
        <StyledConfirmButton
          onClick={handleConfirmDelete}
          sx={{
            marginBottom: '16px',
            marginRight: '20px',
          }}
        >
          Delete
        </StyledConfirmButton>
        <StyledDeclineButton
          onClick={handleClose}
          sx={{
            marginBottom: '16px',
            marginRight: '20px',
          }}
        >
          Cancel
        </StyledDeclineButton>
      </Box>
    </Dialog>
  );
}
