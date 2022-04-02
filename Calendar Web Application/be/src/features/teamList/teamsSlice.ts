import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { User } from '../userList/usersSlice';
import api from '../../app/api';
import { toast } from 'react-toastify';

export interface Team {
  id?: number;
  teamName: string;
  users: User[];
}

type apiCallStates = 'default' | 'fetching' | 'error' | 'ok';

export interface TeamsState {
  teamList: Team[];
  getStatus: apiCallStates;
  postStatus: apiCallStates;
  updateStatus: apiCallStates;
  deleteStatus: apiCallStates;
  errorType: 'none' | 'TeamExists' | 'TeamNotFound' | 'UserInAnotherTeam' | 'Generic';
  duplicateUsers: string[];
}

const initialState: TeamsState = {
  teamList: [],
  getStatus: 'default',
  postStatus: 'default',
  updateStatus: 'default',
  deleteStatus: 'default',
  errorType: 'none',
  duplicateUsers: [],
};

/**
 * Replaces Users in Team with userID
 * @param teamObject
 * @return smallTeamObject
 */
const replaceUsersWithIds = (teamObject: Team) => {
  const { users, ...rest } = teamObject;
  const memberIds = users.map((user) => user.id);
  return { ...rest, memberIds };
};

export const getTeams = createAsyncThunk('getTeams', async () => {
  const response = await api.get('/teams');
  return response.data;
});

export const postTeam = createAsyncThunk('postTeam', async (teamObject: Team, thunkAPI) => {
  const smallTeamObject = replaceUsersWithIds(teamObject);
  try {
    const response = await api.post('/teams', smallTeamObject);
    if (response.status === 201) {
      teamObject.id = response.data as number;
      thunkAPI.dispatch(addNewTeam(teamObject));
      thunkAPI.dispatch(setPostStatus('ok'));
    }
  } catch (error: any) {
    const additionalData = error.response.data.additionalData;
    if (error.response.status === 409) {
      if (additionalData.errorType === 'TeamExistsException') {
        thunkAPI.dispatch(setPostStatus('error'));
        thunkAPI.dispatch(setErrorType('TeamExists'));
      } else if (additionalData.errorType === 'UserInAnotherTeamException') {
        thunkAPI.dispatch(setPostStatus('error'));
        thunkAPI.dispatch(setErrorType('UserInAnotherTeam'));
        const duplicateUsers = additionalData.duplicateUsers;
        thunkAPI.dispatch(setDuplicates(duplicateUsers));
      }
    } else if (error.response.status >= 400) {
      thunkAPI.dispatch(setPostStatus('error'));
      thunkAPI.dispatch(setErrorType('Generic'));
    }
  }
});

export const deleteTeam = createAsyncThunk('deleteTeam', async (teamId: number, thunkAPI) => {
  await toast.promise(
    api.delete(`/teams/${teamId}`),
    {
      pending: 'Deleting...',
      success: 'Deleted successfully',
      error: 'Failed to delete',
    },
    { containerId: 'main-toast-container' },
  );
  return teamId;
});

export const updateTeam = createAsyncThunk('updateTeam', async (teamObject: Team, thunkAPI) => {
  const smallTeamObject = replaceUsersWithIds(teamObject);
  try {
    const response = await api.put('/teams/' + teamObject.id, smallTeamObject);
    if (response.status === 200) {
      teamObject = response.data;
      thunkAPI.dispatch(updateOldTeam(teamObject));
      thunkAPI.dispatch(setUpdateStatus('ok'));
    }
  } catch (error: any) {
    const additionalData = error.response.data.additionalData;
    if (error.response.status === 409) {
      if (additionalData.errorType === 'TeamExistsException') {
        thunkAPI.dispatch(setUpdateStatus('error'));
        thunkAPI.dispatch(setErrorType('TeamExists'));
      } else if (additionalData.errorType === 'UserInAnotherTeamException') {
        thunkAPI.dispatch(setUpdateStatus('error'));
        thunkAPI.dispatch(setErrorType('UserInAnotherTeam'));
        const duplicateUsers = additionalData.duplicateUsers;
        thunkAPI.dispatch(setDuplicates(duplicateUsers));
      } else if (additionalData.errorType === 'TeamNotFoundException') {
        thunkAPI.dispatch(setUpdateStatus('error'));
        thunkAPI.dispatch(setErrorType('TeamNotFound'));
      }
    } else if (error.response.status >= 400) {
      thunkAPI.dispatch(setUpdateStatus('error'));
      thunkAPI.dispatch(setErrorType('Generic'));
    }
  }
});

export const teamSlice = createSlice({
  name: 'teamSlice',
  initialState,
  reducers: {
    addNewTeam: (state, action) => {
      state.teamList.push(action.payload);
    },
    setPostStatus: (state, action) => {
      state.postStatus = action.payload;
    },
    setErrorType: (state, action) => {
      state.errorType = action.payload;
    },
    setDuplicates: (state, action) => {
      state.duplicateUsers = action.payload;
    },
    updateOldTeam: (state, action) => {
      state.teamList = state.teamList.map((team) => {
        if (team.id === action.payload.id) {
          return action.payload;
        } else {
          return team;
        }
      });
    },
    setUpdateStatus: (state, action) => {
      state.updateStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTeams.pending, (state) => {
        state.getStatus = 'fetching';
      })
      .addCase(getTeams.fulfilled, (state, action) => {
        const retrievedTeams = action.payload as Team[];
        state.getStatus = 'ok';
        state.teamList = retrievedTeams;
      })
      .addCase(getTeams.rejected, (state) => {
        state.getStatus = 'error';
        state.teamList = [];
      })

      .addCase(postTeam.pending, (state) => {
        state.postStatus = 'fetching';
      })
      .addCase(postTeam.rejected, (state, action) => {
        state.postStatus = 'error';
        state.errorType = 'Generic';
      })

      .addCase(updateTeam.pending, (state) => {
        state.updateStatus = 'fetching';
      })
      .addCase(updateTeam.rejected, (state, action) => {
        state.updateStatus = 'error';
      })

      .addCase(deleteTeam.fulfilled, (state, action) => {
        state.teamList = state.teamList.filter((team) => team.id !== action.payload);
      });
  },
});

export const {
  addNewTeam,
  setPostStatus,
  setErrorType,
  setDuplicates,
  updateOldTeam,
  setUpdateStatus,
} = teamSlice.actions;

export const selectTeamGetState = (state: RootState) => state.teams.getStatus;
export const selectTeams = (state: RootState) => state.teams.teamList;
export const selectTeamPostState = (state: RootState) => state.teams.postStatus;
export const selectTeamErrorState = (state: RootState) => state.teams.errorType;
export const selectDuplicateUsers = (state: RootState) => state.teams.duplicateUsers;
export const selectTeamUpdateState = (state: RootState) => state.teams.updateStatus;

export default teamSlice.reducer;
