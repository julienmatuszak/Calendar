import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { TableCell, TableRow, Button, TextField, Box } from '@mui/material';
import { ReactComponent as ColorPickerSubmitIcon } from '../../../resources/color-picker-submit.svg';
import { ColorPicker } from '../colorPicker/ColorPicker';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  selectTimeOffTypeEditState,
  setTimeOffTypesEditState,
  updateTimeOffType,
} from '../timeOffTypesSlice';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { ConfirmationAlert } from '../confirmationAlert/ConfirmationAlert';
import DeleteTimeOffType from '../deleteTimeOffType/DeleteTimeOffType';

export function EditTypeRow({
  id,
  name,
  color,
  setEditable,
}: {
  id: number;
  name: string;
  color: string;
  setEditable: Dispatch<SetStateAction<boolean>>;
}) {
  const appDispatch = useAppDispatch();
  const [pickedColor, setPickedColor] = useState<string>('#' + color);
  const [value, setValue] = useState<string>(name);
  const [inputError, setInputError] = useState<string | null>(null);
  const [colorPickerBorder, setColorPickerBorder] = useState<string>(
    '1px solid rgba(0, 0, 0, 0.12)',
  );
  const [open, setOpen] = useState<boolean>(false);

  const editReqState = useAppSelector(selectTimeOffTypeEditState);

  useEffect(() => {
    if (!editReqState.startsWith('e')) {
      setInputError(null);
      if (editReqState === 'ok') {
        handleClose();
      }
    } else {
      setInputError(editReqState.substring(1));
    }
    // eslint-disable-next-line
  }, [editReqState]);

  const handleClose = () => {
    appDispatch(setTimeOffTypesEditState('default'));
    setValue('');
    setEditable(false);
  };

  const validateInputs = (newName: string, newColor: string): boolean => {
    let newNameCorrect = false;
    let newColorCorrect = false;
    if (newName.length === 0) {
      setInputError('Field must not be empty');
    } else if (newName.length > 100) {
      setInputError('Max 100 characters');
    } else {
      setInputError(null);
      newNameCorrect = true;
    }

    if (newColor === 'ffffff') {
      setColorPickerBorder('2px solid #d32f2f');
    } else {
      setColorPickerBorder('1px solid rgba(0, 0, 0, 0.12)');
      newColorCorrect = true;
    }
    return newNameCorrect && newColorCorrect;
  };

  const approveSave = () => {
    const editedTimeOffType = {
      id: id,
      name: value,
      color: pickedColor.substring(1), //Removing '#' before saving to database
    };

    if (validateInputs(editedTimeOffType.name, editedTimeOffType.color)) {
      appDispatch(updateTimeOffType(editedTimeOffType));
    }
    setOpen(false);
  };

  const handleClickAway = () => {
    handleClose();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (value === name && color === pickedColor.substring(1)) {
      setEditable(false);
    } else {
      setOpen(true);
    }
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <TableRow sx={{ '&:last-child td': { borderBottom: 0 } }}>
        <TableCell
          sx={{
            padding: '7px',
            borderRight: '1px solid rgba(0, 0, 0, 0.12)',
          }}
        >
          <ColorPicker
            setPickedColor={setPickedColor}
            pickedColor={pickedColor}
            colorPickerBorder={colorPickerBorder}
          />
        </TableCell>
        <TableCell sx={{ paddingTop: '10px', paddingBottom: '10px' }}>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <TextField
              required
              variant="standard"
              title="New Time Off type"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              autoFocus
              error={inputError !== null}
              helperText={inputError}
              inputProps={{ style: { fontSize: '12px', fontFamily: 'Open Sans' } }}
              sx={{
                width: '75%',
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Button type="submit" sx={{ minWidth: 'fit-content' }}>
                <ColorPickerSubmitIcon />
              </Button>
              <DeleteTimeOffType id={id!} />
            </div>
          </Box>
        </TableCell>
        {<ConfirmationAlert open={open} onClose={handleClose} approveSave={approveSave} />}
      </TableRow>
    </ClickAwayListener>
  );
}
