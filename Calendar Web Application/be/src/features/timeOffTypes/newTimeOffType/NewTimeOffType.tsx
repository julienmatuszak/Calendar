import React, { useEffect, useState } from 'react';
import { TableCell, TableRow, Button, TextField, Box } from '@mui/material';
import { ReactComponent as ColorPickerSubmitIcon } from '../../../resources/color-picker-submit.svg';
import { ReactComponent as ColorPickerDiscardIcon } from '../../../resources/discard.svg';
import { ColorPicker } from '../colorPicker/ColorPicker';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  TimeOffType,
  createNewTimesOffType,
  setIsAddNewType,
  selectTimeOffTypeAddState,
  setTimeOffTypesAddState,
} from '../timeOffTypesSlice';

export function NewTypeRow() {
  const appDispatch = useAppDispatch();
  const [pickedColor, setPickedColor] = useState<string>('#404CFA');
  const [inputError, setInputError] = useState<string | null>(null);
  const [value, setValue] = useState<string>('');
  const [colorPickerBorder, setColorPickerBorder] = useState<string>(
    '1px solid rgba(0, 0, 0, 0.12)',
  );

  const addState = useAppSelector(selectTimeOffTypeAddState);

  useEffect(() => {
    if (addState === 'ok') {
      handleClose();
    } else if (addState.startsWith('e')) {
      setInputError(addState.substring(1));
    }
    // eslint-disable-next-line
  }, [addState]);

  const handleClose = () => {
    setPickedColor('#404CFA');
    setValue('');
    setInputError(null);
    appDispatch(setTimeOffTypesAddState('default'));
  };

  const handleDiscardNewTypeForm = () => {
    appDispatch(setIsAddNewType(false));
    handleClose();
  };

  const validateInputs = ({ name, color }: TimeOffType): boolean => {
    let nameCorrect = false;
    let colorCorrect = false;
    if (name.length === 0) {
      setInputError('Field must not be empty');
    } else if (name.length > 100) {
      setInputError('Max 100 characters');
    } else {
      setInputError(null);
      nameCorrect = true;
    }

    if (color === 'ffffff') {
      setColorPickerBorder('2px solid #d32f2f');
    } else {
      setColorPickerBorder('1px solid rgba(0, 0, 0, 0.12)');
      colorCorrect = true;
    }
    return nameCorrect && colorCorrect;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newTimeOffType = {
      id: -1,
      name: value,
      color: pickedColor.substring(1), //Removing '#' before saving to database
    };

    if (validateInputs(newTimeOffType)) {
      appDispatch(createNewTimesOffType(newTimeOffType));
    }
  };

  return (
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
            placeholder="Enter title"
            autoFocus
            error={inputError !== null}
            helperText={inputError}
            inputProps={{ style: { fontSize: '12px', fontFamily: 'Open Sans' } }}
            sx={{
              width: '75%',
            }}
          />
          <div>
            <Button type="submit" sx={{ minWidth: 'fit-content' }}>
              <ColorPickerSubmitIcon />
            </Button>
            <Button onClick={handleDiscardNewTypeForm} sx={{ minWidth: 'fit-content' }}>
              <ColorPickerDiscardIcon />
            </Button>
          </div>
        </Box>
      </TableCell>
    </TableRow>
  );
}
