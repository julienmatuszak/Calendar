import React, { useState } from 'react';
import { Box, Button, Dialog, DialogTitle } from '@mui/material';
import { ReactComponent as DeleteTimeOffTypeIcon } from '../../../resources/discard.svg';
import { useAppDispatch } from '../../../app/hooks';
import { deleteTimeOffType } from '../timeOffTypesSlice';
import StyledConfirmButton from '../../../components/styledConfirmButton/StyledConfirmButton';
import StyledDeclineButton from '../../../components/styledDeclineButton/StyledDeclineButton';

type Props = {
  onClose: any;
  open: boolean;
  id: number;
};

function SimpleDialog(props: Props) {
  const { onClose, open, id } = props;

  const dispatch = useAppDispatch();

  const handleConfirmDelete = () => {
    dispatch(deleteTimeOffType(id));
    onClose();
  };

  const handleClose = () => {
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
        Are you sure you want to delete this time off type?
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

export default function DeleteTimeOffType({ id }: { id: number }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button onClick={handleOpen} sx={{ minWidth: 'fit-content', padding: '0px 8px' }}>
        <DeleteTimeOffTypeIcon />
      </Button>
      <SimpleDialog open={open} onClose={handleClose} id={id} />
    </>
  );
}
