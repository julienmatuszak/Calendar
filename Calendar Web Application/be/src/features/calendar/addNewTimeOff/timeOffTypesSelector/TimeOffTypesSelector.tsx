import { MenuItem, TextField } from '@mui/material';
import { TimeOffType } from '../../../timeOffTypes/timeOffTypesSlice';

const TimeOffTypesSelector = ({
  typeValue,
  setNewTimeOff,
  timeOffTypes,
  errorText,
}: {
  typeValue: string;
  setNewTimeOff: any;
  timeOffTypes: TimeOffType[];
  errorText: string;
}) => {
  const handleChange = (event: any) => {
    const timeOffType = timeOffTypes.find((timeOffType) => event.target.value === timeOffType.name);
    setNewTimeOff(timeOffType);
  };

  return (
    <TextField
      select
      variant={'filled'}
      label={'Type'}
      fullWidth
      value={typeValue}
      onChange={handleChange}
      error={errorText !== ''}
      helperText={errorText}
    >
      {timeOffTypes.length === 0 ? (
        <MenuItem value="">List is empty</MenuItem>
      ) : (
        timeOffTypes.map((val) => (
          <MenuItem key={val.id} value={val.name}>
            {val.name}
          </MenuItem>
        ))
      )}
    </TextField>
  );
};

export default TimeOffTypesSelector;
