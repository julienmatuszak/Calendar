import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import moment from 'moment';
import api from '../../app/api';
import { toast } from 'react-toastify';
import { selectUserId } from '../login/loginSlice';
import { selectTimeOffType, TimeOffType } from '../timeOffTypes/timeOffTypesSlice';
import { dateToString } from '../../utils/dateConvertions';

export interface CalendarState {
  status: 'default' | 'fetching' | 'error' | 'ok';
  isAddTimeOffModalOpen: boolean;
  addTimeOffError: string | undefined;
  addTimeOffRequestStatus: 'default' | 'pending' | 'error' | 'ok';
  groups: any;
  items: any;
  visibleTime: {
    visibleTimeStart: number;
    visibleTimeEnd: number;
  };
  teamName: string;
}

const initialState: CalendarState = {
  status: 'default',
  isAddTimeOffModalOpen: false,
  addTimeOffError: '',
  addTimeOffRequestStatus: 'default',
  groups: [],
  items: [],
  visibleTime: {
    visibleTimeEnd: moment().endOf('month').valueOf(),
    visibleTimeStart: moment().startOf('month').valueOf(),
  },
  teamName: '',
};

export const fillCalendarGroups = createAsyncThunk(
  'calendar/fillCalendarGroups',
  async (_, thunkAPI) => {
    const userId = selectUserId(thunkAPI.getState() as RootState);
    const groupsResponse = await api.get('/teams/user/' + userId);
    const { teamName, users } = groupsResponse.data;
    thunkAPI.dispatch(setTeamName(teamName));
    return users.map((elem: any) => ({
      id: elem.id,
      userName: elem.userName,
    }));
  },
);

export const fillCalendarItems = createAsyncThunk(
  'calendar/fillCalendarItems',
  async (_, thunkAPI) => {
    const timeOffs = await api.get('/time_off');
    const timeOffTypes = (await api.get('/time_off_types')).data;

    return timeOffs.data.map((elem: any) => ({
      startDate: new Date(elem.startDate).setHours(0, 0, 0),
      endDate: new Date(elem.endDate).setHours(0, 0, 0),
      shortTypeName: elem.timeOffTypeName[0],
      fullTypeName: elem.timeOffTypeName,
      timeOffTypeId: elem.timeOffTypeId,
      id: elem.id,
      userId: elem.userId,
      color: timeOffTypes.find((type: TimeOffType) => type.id === elem.timeOffTypeId)?.color,
    }));
  },
);

export interface NewTimeOff {
  timeOffType: {
    id: number;
    name: string;
  };
  startDate: Date;
  endDate: Date;
}

export const saveNewTimeOffRecord = createAsyncThunk(
  'calendar/saveNewTimeOffRecord',
  async (newTimeOffRecord: NewTimeOff, thunkAPI) => {
    const userId = selectUserId(thunkAPI.getState() as RootState);

    const request = {
      endDate: dateToString(newTimeOffRecord.endDate),
      startDate: dateToString(newTimeOffRecord.startDate),
      timeOffTypeId: newTimeOffRecord.timeOffType.id,
      userId,
    };

    let response;
    try {
      response = await api.post('time_off', request);
    } catch (e: any) {
      throw new Error(e.response ? e.response.data.errorMessage : 'Service error');
    }

    const type = selectTimeOffType(newTimeOffRecord.timeOffType.id)(
      thunkAPI.getState() as RootState,
    );

    return {
      userId,
      id: response.data,
      shortTypeName: type?.name[0],
      fullTypeName: type?.name,
      timeOffTypeId: newTimeOffRecord.timeOffType.id,
      startDate: newTimeOffRecord.startDate.setHours(0, 0, 0),
      endDate: newTimeOffRecord.endDate.setHours(0, 0, 0),
      color: type?.color,
    };
  },
);

export const deleteTimeOff = createAsyncThunk('delete_time_off', async (id: number) => {
  const response = await toast.promise(
    api.delete('/time_off/' + id),
    {
      pending: 'Deleting...',
      success: 'Deleted successfully',
      error: 'Failed to delete',
    },
    { containerId: 'main-toast-container' },
  );
  if (response.status === 200) {
    return id;
  }
});
export const editTimeOff = createAsyncThunk('edit_time_off', async (item: any, thunkAPI) => {
  const userId = selectUserId(thunkAPI.getState() as RootState);

  const request = {
    endDate: dateToString(item.endDate),
    startDate: dateToString(item.startDate),
    timeOffTypeId: item.timeOffType.id,
    userId,
  };

  try {
    await toast.promise(
      api.put('/time_off/' + item.id, request),
      {
        pending: 'Updating...',
        success: 'Updated successfully',
        error: 'Failed to update',
      },
      { containerId: 'main-toast-container' },
    );
  } catch (e: any) {
    throw new Error(e.response ? e.response.data.errorMessage : 'Service error');
  }

  const type = selectTimeOffType(item.timeOffType.id)(thunkAPI.getState() as RootState);

  return {
    userId,
    id: item.id,
    shortTypeName: type?.name[0],
    fullTypeName: type?.name,
    startDate: item.startDate.setHours(0, 0, 0),
    endDate: item.endDate.setHours(0, 0, 0),
    color: type?.color,
    timeOffTypeId: item.timeOffType.id,
  };
});

export const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setAddTimeOffRequestStatus: (state, action) => {
      state.addTimeOffRequestStatus = action.payload;
    },
    setTeamName: (state, action) => {
      state.teamName = action.payload;
    },
    setPrevMonth: (state) => {
      state.visibleTime.visibleTimeStart = moment(state.visibleTime.visibleTimeStart)
        .subtract(1, 'month')
        .startOf('month')
        .valueOf();
      state.visibleTime.visibleTimeEnd = moment(state.visibleTime.visibleTimeEnd)
        .subtract(1, 'month')
        .endOf('month')
        .valueOf();
    },
    setNextMonth: (state) => {
      state.visibleTime.visibleTimeStart = moment(state.visibleTime.visibleTimeStart)
        .add(1, 'month')
        .startOf('month')
        .valueOf();
      state.visibleTime.visibleTimeEnd = moment(state.visibleTime.visibleTimeEnd)
        .add(1, 'month')
        .endOf('month')
        .valueOf();
    },
    setIsAddTimeOffModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isAddTimeOffModalOpen = action.payload;
    },
    updateTimeOffs: (state, action) => {
      const { id, name, color } = action.payload;
      for (let i = 0; i < state.items.length; i++) {
        if (state.items[i].timeOffTypeId === id) {
          state.items[i].shortTypeName = name[0];
          state.items[i].fullTypeName = name;
          state.items[i].color = color;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fillCalendarGroups.pending, (state) => {
        state.status = 'fetching';
      })
      .addCase(fillCalendarGroups.fulfilled, (state, action) => {
        state.status = 'ok';
        state.groups = action.payload;
      })
      .addCase(fillCalendarGroups.rejected, (state) => {
        state.status = 'error';
      })
      .addCase(fillCalendarItems.pending, (state) => {
        state.status = 'fetching';
      })
      .addCase(fillCalendarItems.fulfilled, (state, action) => {
        state.status = 'ok';
        state.items = action.payload;
      })
      .addCase(fillCalendarItems.rejected, (state) => {
        state.status = 'error';
      })
      .addCase(editTimeOff.pending, (state, action) => {
        state.addTimeOffError = '';
      })
      .addCase(editTimeOff.rejected, (state, action) => {
        state.addTimeOffRequestStatus = 'error';
        state.addTimeOffError = action.error.message;
      })
      .addCase(editTimeOff.fulfilled, (state, action: any) => {
        state.addTimeOffRequestStatus = 'ok';
        state.items = state.items.map((timeOff: any) => {
          if (timeOff.id === action.payload.id) {
            return action.payload;
          } else {
            return timeOff;
          }
        });
      })
      .addCase(deleteTimeOff.fulfilled, (state, action) => {
        state.items = state.items.filter((item: any) => item.id !== action.payload);
      })
      .addCase(saveNewTimeOffRecord.pending, (state, action) => {
        state.addTimeOffError = '';
      })
      .addCase(saveNewTimeOffRecord.fulfilled, (state, action) => {
        state.addTimeOffError = '';
        state.addTimeOffRequestStatus = 'ok';
        state.items.push(action.payload);
      })
      .addCase(saveNewTimeOffRecord.rejected, (state, action) => {
        state.addTimeOffRequestStatus = 'error';
        state.addTimeOffError = action.error.message;
      });
  },
});

export const { setPrevMonth, setNextMonth } = calendarSlice.actions;
export const selectVisibleTime = (state: RootState) => state.calendar.visibleTime;
export const selectGroups = (state: RootState) => state.calendar.groups;
export const selectItems = (state: RootState) => state.calendar.items;
export const selectIsAddTimeOffModalOpen = (state: RootState) =>
  state.calendar.isAddTimeOffModalOpen;
export const selectAddTimeOffError = (state: RootState) => state.calendar.addTimeOffError;
export const selectAddTimeOffRequestStatus = (state: RootState) =>
  state.calendar.addTimeOffRequestStatus;
export const selectTeamName = (state: RootState) => state.calendar.teamName;

export const { setIsAddTimeOffModalOpen, setAddTimeOffRequestStatus, setTeamName, updateTimeOffs } =
  calendarSlice.actions;

export default calendarSlice.reducer;
