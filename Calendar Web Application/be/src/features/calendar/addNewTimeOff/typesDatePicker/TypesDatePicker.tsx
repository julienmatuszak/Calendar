import { TextField } from '@mui/material';
import { useState } from 'react';
import { DatePicker } from '@mui/lab';

const TypesDatePicker = ({
  dateLabel,
  pickDate,
  dateValue,
  errorText,
}: {
  dateLabel: string;
  pickDate: any;
  dateValue: Date | null;
  errorText: string;
}) => {
  const [dateFocus, setDateFocus] = useState<boolean>(false);

  const handleChange = (newValue: any) => {
    pickDate(newValue._d);
  };

  const handleOnClick = (dialogOpen: any) => {
    dialogOpen();
    setDateFocus(false);
  };

  return (
    <>
      <DatePicker
        label={dateLabel}
        value={dateValue}
        onChange={handleChange}
        renderInput={(params: any) => {
          const endAdornment: any = params.InputProps.endAdornment;
          params.inputProps.type = 'button';
          params.InputProps.endAdornment = null;
          params.inputProps.value = dateValue?.toDateString().substring(4);
          return (
            <TextField
              {...params}
              variant="filled"
              error={errorText !== ''}
              helperText={errorText}
              onClick={(e) => {
                handleOnClick(
                  endAdornment
                    ? endAdornment.props.children.props.onClick
                    : params.inputProps.onClick,
                );
              }}
              focused={dateFocus}
            />
          );
        }}
      />
    </>
  );
};

export default TypesDatePicker;
