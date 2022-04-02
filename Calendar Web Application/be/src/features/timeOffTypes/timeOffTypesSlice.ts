import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import api from '../../app/api';
import { toast } from 'react-toastify';
import { updateTimeOffs } from '../calendar/calendarSlice';

export interface TimeOffType {
  id: number;
  name: string;
  color: string;
}

export interface TimeOffTypesState {
  timeOffTypesList: TimeOffType[];
  status: 'default' | 'fetching' | 'error' | 'ok';
  addState: 'default' | 'fetching' | 'ok' | string;
  editState: 'default' | 'fetching' | 'ok' | string;
  isAddNewType: boolean;
}
const initialState: TimeOffTypesState = {
  timeOffTypesList: [],
  status: 'default',
  addState: 'default',
  editState: 'default',
  isAddNewType: false,
};

export const deleteTimeOffType = createAsyncThunk('delete_time_off_type', async (id: number) => {
  const response = await toast.promise(
    api.delete('/time_off_types/' + id),
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

export const getTimeOffTypes = createAsyncThunk('time_off_types', async () => {
  const response = await api.get('/time_off_types');
  return response.data;
});

export const createNewTimesOffType = createAsyncThunk(
  'cerate_time_off_type',
  async (newTimeOffType: TimeOffType) => {
    try {
      const response = await toast.promise(
        api.post('/time_off_types', newTimeOffType),
        {
          pending: 'Saving...',
          success: 'Saved successfully',
          error: 'Failed to save',
        },
        {
          containerId: 'main-toast-container',
        },
      );
      if (response.status === 200) {
        return response.data;
      }
    } catch (e) {
      throw new Error(e.response?.data?.errorMessage || 'Service error');
    }
  },
);

export const updateTimeOffType = createAsyncThunk(
  'update_time_off_type',
  async (newTimeOffType: TimeOffType, thunkAPI) => {
    try {
      const response = await toast.promise(
        api.put('/time_off_types/' + newTimeOffType.id, newTimeOffType),
        {
          pending: 'Updating...',
          success: 'Updated successfully',
          error: 'Failed to update',
        },
        { containerId: 'main-toast-container' },
      );
      thunkAPI.dispatch(updateTimeOffs(newTimeOffType));
      return response.data;
    } catch (e) {
      throw new Error(e.response?.data?.errorMessage || 'Service error');
    }
  },
);

export const timeOffTypesSlice = createSlice({
  name: 'timeOffTypesSlice',
  initialState: initialState,
  reducers: {
    setIsAddNewType(state, action: PayloadAction<boolean>) {
      state.isAddNewType = action.payload;
    },
    setTimeOffTypesAddState: (state, action) => {
      state.addState = action.payload;
    },
    setTimeOffTypesEditState: (state, action) => {
      state.editState = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTimeOffTypes.pending, (state) => {
        state.status = 'fetching';
      })
      .addCase(getTimeOffTypes.fulfilled, (state, action) => {
        state.status = 'ok';
        state.timeOffTypesList = action.payload;
      })
      .addCase(getTimeOffTypes.rejected, (state) => {
        state.status = 'error';
        state.timeOffTypesList = [];
      })
      .addCase(createNewTimesOffType.pending, (state) => {
        state.addState = 'fetching';
      })
      .addCase(createNewTimesOffType.fulfilled, (state, action) => {
        state.addState = 'ok';
        state.timeOffTypesList.push(action.payload);
      })
      .addCase(createNewTimesOffType.rejected, (state, action) => {
        state.addState = `e${action?.error?.message || 'Service error'}`;
      })
      .addCase(updateTimeOffType.pending, (state) => {
        state.editState = 'fetching';
      })
      .addCase(updateTimeOffType.fulfilled, (state, action) => {
        state.editState = 'ok';
        state.timeOffTypesList = state.timeOffTypesList.map((timeOffType) => {
          if (timeOffType.id === action.payload.id) {
            return action.payload;
          } else {
            return timeOffType;
          }
        });
      })
      .addCase(updateTimeOffType.rejected, (state, action) => {
        state.editState = `e${action?.error?.message || 'Service error'}`;
      })
      .addCase(deleteTimeOffType.pending, (state) => {
        state.status = 'fetching';
      })
      .addCase(deleteTimeOffType.fulfilled, (state, action) => {
        state.status = 'ok';
        state.timeOffTypesList = state.timeOffTypesList.filter(
          (timeOffType) => timeOffType.id !== action.payload,
        );
      })
      .addCase(deleteTimeOffType.rejected, (state) => {
        state.status = 'error';
      });
  },
});

export const selectTimeOffTypesGetState = (state: RootState) => state.timeOffTypes.status;
export const selectTimeOffTypes = (state: RootState) => state.timeOffTypes.timeOffTypesList;
export const selectTimeOffType = (id: number) => (state: RootState) =>
  state.timeOffTypes.timeOffTypesList.find((type) => type.id === id);
export const selectIsAddNewType = (state: RootState) => state.timeOffTypes.isAddNewType;
export const selectTimeOffTypeAddState = (state: RootState) => state.timeOffTypes.addState;
export const selectTimeOffTypeEditState = (state: RootState) => state.timeOffTypes.editState;

export const { setIsAddNewType, setTimeOffTypesAddState, setTimeOffTypesEditState } =
  timeOffTypesSlice.actions;

export default timeOffTypesSlice.reducer;
