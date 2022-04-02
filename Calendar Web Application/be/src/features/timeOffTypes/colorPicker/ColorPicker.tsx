import React, { useState } from 'react';
import reactCSS from 'reactcss';
import { ChromePicker } from 'react-color';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { ReactComponent as ColorPickerIcon } from '../../../resources/color-picker.svg';
import { Button } from '@mui/material';
import './ColorPicker.css';

export function ColorPicker({
  setPickedColor,
  pickedColor,
  colorPickerBorder,
}: {
  setPickedColor: any;
  pickedColor: string;
  colorPickerBorder: string;
}) {
  const [openPopup, setOpenPopup] = useState<boolean>(false);

  const handleColorChange = (updateColor: any) => {
    setPickedColor(updateColor.hex);
  };
  const handleSaveColor = () => {
    setPickedColor(pickedColor);
    setOpenPopup(false);
  };

  const handleOpenPopup = () => {
    setOpenPopup((prevCheck) => !prevCheck);
  };

  //Need this style here and not in css to change color dynamically
  const styles = reactCSS({
    default: {
      color: {
        width: '18px',
        height: '18px',
        borderRadius: '4px',
        background: `${pickedColor}`,
      },
    },
  });

  return (
    <div>
      <Button
        id="basic-button"
        onClick={handleOpenPopup}
        sx={{
          padding: '5px',
          background: '#fff',
          borderRadius: '4px',
          border: `${colorPickerBorder}`,
          cursor: 'pointer',
          display: 'flex',
          minWidth: 'fit-content',
        }}
      >
        <div style={styles.color} />
        <ColorPickerIcon />
      </Button>
      {openPopup && (
        <ClickAwayListener onClickAway={handleSaveColor}>
          <div className="popup_container">
            <div className="popup_open">
              <p className="popup_open__header">pick a color</p>
              <ChromePicker
                className="chrome-picker"
                color={pickedColor}
                onChange={handleColorChange}
                disableAlpha={true}
              />
            </div>
          </div>
        </ClickAwayListener>
      )}
    </div>
  );
}
