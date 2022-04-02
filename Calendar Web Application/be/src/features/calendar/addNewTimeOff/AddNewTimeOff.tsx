import { Box, Modal, Typography } from '@mui/material';
import styles from './AddNewTimeOff.module.css';

import VacationTypesSelector from './timeOffTypesSelector/TimeOffTypesSelector';
import TypesDatePicker from './typesDatePicker/TypesDatePicker';
import DateAdapter from '@mui/lab/AdapterMoment';
import { LocalizationProvider } from '@mui/lab';
import { useEffect, useState } from 'react';
import {
  NewTimeOff,
  selectAddTimeOffError,
  selectAddTimeOffRequestStatus,
  selectIsAddTimeOffModalOpen,
  setAddTimeOffRequestStatus,
  setIsAddTimeOffModalOpen,
} from '../calendarSlice';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectTimeOffTypes } from '../../timeOffTypes/timeOffTypesSlice';
import moment from 'moment';
import StyledDeclineButton from '../../../components/styledDeclineButton/StyledDeclineButton';
import StyledConfirmButton from '../../../components/styledConfirmButton/StyledConfirmButton';

const AddNewTimeOff = (
  { onClose, openEdit, itemSelected, actionCreator, title, confirmText }: any = {
    onClose: null,
    openEdit: false,
    itemSelected: null,
  },
) => {
  const initialState: any = itemSelected
    ? {
        startDate: moment(itemSelected.startDate).toDate(),
        endDate: moment(itemSelected.endDate).toDate(),
        timeOffType: { id: itemSelected.timeOffTypeId, name: itemSelected.fullTypeName },
        id: itemSelected.id,
      }
    : {
        timeOffType: { id: -1, name: '' },
        startDate: moment().toDate(),
        endDate: moment().add(1, 'day').toDate(),
      };

  const initialErrorText = {
    select: '',
    date: '',
  };

  const [errorText, setErrorText] = useState(initialErrorText);

  const [newTimeOff, setNewTimeOff] = useState(initialState);
  const setTimeOffType = (timeOffType: { id: number; name: string }) => {
    setNewTimeOff({
      ...newTimeOff,
      timeOffType,
    });
  };

  const setStartDate = (startDate: Date) => {
    setNewTimeOff({
      ...newTimeOff,
      startDate,
    });
  };

  const setEndDate = (endDate: Date) => {
    setNewTimeOff({
      ...newTimeOff,
      endDate,
    });
  };

  const isValid = (newTimeOff: NewTimeOff) => {
    let validFlag = true;

    const newErrorText = {
      date: '',
      select: '',
    };

    if (newTimeOff.timeOffType.id < 0) {
      newErrorText.select = 'Field must be not empty';
      validFlag = false;
    }

    const { startDate, endDate } = newTimeOff;
    if (
      startDate.getTime() >= endDate.getTime() ||
      (startDate.getMonth() === endDate.getMonth() && startDate.getDate() === endDate.getDate())
    ) {
      newErrorText.date = 'Invalid data range';
      validFlag = false;
    }

    setErrorText(newErrorText);
    return validFlag;
  };

  const dispatch = useAppDispatch();

  const handleSubmit = (e: any) => {
    if (isValid(newTimeOff)) {
      dispatch(actionCreator(newTimeOff));
    }
  };

  const timeOffTypes = useAppSelector(selectTimeOffTypes);
  const isOpen = useAppSelector(selectIsAddTimeOffModalOpen);
  const serverErrorText = useAppSelector(selectAddTimeOffError);
  const requestState = useAppSelector(selectAddTimeOffRequestStatus);

  const handleClose = () => {
    onClose && onClose();
    setNewTimeOff(initialState);
    setErrorText(initialErrorText);
    dispatch(setIsAddTimeOffModalOpen(false));
    dispatch(setAddTimeOffRequestStatus('default'));
  };

  useEffect(() => {
    if (requestState === 'ok') {
      handleClose();
    }
    // eslint-disable-next-line
  }, [requestState]);

  return (
    <LocalizationProvider dateAdapter={DateAdapter}>
      <Modal
        open={isOpen || openEdit}
        onClose={handleClose}
        disableAutoFocus
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          className={styles.add_new_time_off__page_center}
          sx={{ padding: '16px 24px 16px 24px' }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {title}
          </Typography>
          <VacationTypesSelector
            typeValue={newTimeOff.timeOffType.name}
            timeOffTypes={timeOffTypes}
            setNewTimeOff={setTimeOffType}
            errorText={errorText.select}
          />
          <div className={styles.add_new_time_off__ranges_layout}>
            <TypesDatePicker
              pickDate={setStartDate}
              dateValue={newTimeOff.startDate}
              dateLabel="Start Date"
              errorText={errorText.date}
            />
            <Typography className={styles.add_new_time_off__to_separation} component={'div'}>
              to
            </Typography>
            <TypesDatePicker
              pickDate={setEndDate}
              dateValue={newTimeOff.endDate}
              dateLabel="End Date"
              errorText={errorText.date}
            />
          </div>

          <div className={styles.add_new_time_off__flex_end}>
            <StyledDeclineButton onClick={handleClose}>Cancel</StyledDeclineButton>
            <StyledConfirmButton onClick={handleSubmit} sx={{ marginLeft: '20px' }}>
              {confirmText}
            </StyledConfirmButton>
          </div>
          {requestState === 'error' && (
            <div className={styles.add_new_time_off__error_message}>{serverErrorText}</div>
          )}
        </Box>
      </Modal>
    </LocalizationProvider>
  );
};

export default AddNewTimeOff;
