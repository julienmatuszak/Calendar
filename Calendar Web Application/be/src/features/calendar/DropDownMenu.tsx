import React, { useState } from 'react';
import DeleteTimeOff from './deleteTimeOff/DeleteTimeOff';
import { Typography, Menu, MenuItem, ListItemText } from '@mui/material';
import AddNewTimeOff from './addNewTimeOff/AddNewTimeOff';
import { editTimeOff } from './calendarSlice';

const menuItemStyle = {
  '&:hover': {
    backgroundColor: '#bbb',
    color: '#bbb',
  },
};

const typographyStyle = {
  fontFamily: 'Poppins',
  fontSize: 12,
  lineHeight: '16px',
  fontWeight: 600,
  color: '#404CFA',
  boxSizing: 'border-box',
  height: 36,
  textTransform: 'uppercase',
};

export default function DropDownMenu({
  setAnchorEl,
  anchorEl,
  onClose,
  itemSelected,
  setItemSelected,
}: {
  setAnchorEl: any;
  anchorEl: any;
  onClose: any;
  itemSelected: any;
  setItemSelected: any;
}) {
  const open = Boolean(anchorEl);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const stopPropagation = function (e: any) {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };

  const handleOpenDelete = (e: any) => {
    stopPropagation(e);
    setOpenDelete(true);
  };

  const handleOpenEdit = (e: any) => {
    stopPropagation(e);
    setOpenEdit(true);
  };

  const handleClose = () => {
    setOpenDelete(false);
    setOpenEdit(false);
    setAnchorEl(null);
    setItemSelected(null);
  };

  return (
    <div>
      <DeleteTimeOff
        onClose={handleClose}
        open={openDelete}
        idSelected={itemSelected.id}
        setItemSelected={setItemSelected}
      />
      <AddNewTimeOff
        onClose={() => {
          handleClose();
          setItemSelected(null);
        }}
        openEdit={openEdit}
        itemSelected={itemSelected}
        actionCreator={editTimeOff}
        title={'Edit time off'}
        confirmText={'Save'}
      />
      <Menu
        id="time-off-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={onClose}
        anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
        transformOrigin={{ vertical: 'center', horizontal: 'center' }}
        disableAutoFocus={true}
        autoFocus={false}
      >
        <MenuItem onClick={handleOpenDelete} sx={menuItemStyle}>
          <ListItemText
            disableTypography
            primary={
              <Typography
                variant="caption"
                // @ts-ignore
                sx={{ ...typographyStyle }}
              >
                delete time off
              </Typography>
            }
          />
        </MenuItem>
        <MenuItem onClick={handleOpenEdit} sx={menuItemStyle}>
          <ListItemText
            disableTypography
            primary={
              <Typography
                variant="caption"
                // @ts-ignore
                sx={{ ...typographyStyle }}
              >
                edit time off
              </Typography>
            }
          />
        </MenuItem>
      </Menu>
    </div>
  );
}
