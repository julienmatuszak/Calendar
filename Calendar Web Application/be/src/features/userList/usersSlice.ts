import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import api from '../../app/api';
import { toast } from 'react-toastify';

export interface User {
  id: number;
  userName: string;
  email: string;
  password?: string;
}

export interface UsersState {
  userList: User[];
  getState: 'default' | 'fetching' | 'error' | 'ok';
  postState: 'default' | 'fetching' | 'error' | 'ok';
  errorType: 'none' | 'UserNameExists' | 'EmailExists' | 'Generic';
}

const initialState: UsersState = {
  userList: [],
  getState: 'default',
  postState: 'default',
  errorType: 'none',
};

export const getUsers = createAsyncThunk('getUsers', async () => {
  const response = await api.get('/users');
  return response.data;
});

export const postUser = createAsyncThunk('postUser', async (userObject: User, thunkAPI) => {
  try {
    const response = await api.post('/users', userObject);
    if (response.status === 201) {
      userObject.id = response.data as number;
      thunkAPI.dispatch(addNewUser(userObject));
      thunkAPI.dispatch(setUserPostState('ok'));
    }
  } catch (error) {
    const additionalData = error.response.data.additionalData;
    if (error.response.status === 409) {
      if (additionalData.errorType === 'UserNameNotUniqueException') {
        thunkAPI.dispatch(setUserPostState('error'));
        thunkAPI.dispatch(setErrorType('UserNameExists'));
      } else if (additionalData.errorType === 'EmailNotUniqueException') {
        thunkAPI.dispatch(setUserPostState('error'));
        thunkAPI.dispatch(setErrorType('EmailExists'));
      }
    } else if (error.response.status >= 400) {
      thunkAPI.dispatch(setUserPostState('error'));
      thunkAPI.dispatch(setErrorType('Generic'));
    }
  }
});

export const removeUser = createAsyncThunk('removeUser', async (id: number, thunkAPI) => {
  if (id == null || id < 0) {
    throw new Error('Invalid id');
  }
  await toast.promise(
    api.delete(`/users/${id}`),
    {
      pending: 'Deleting...',
      success: 'Deleted successfully',
      error: 'Failed to delete',
    },
    { containerId: 'main-toast-container' },
  );
  return id;
});

export const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addNewUser: (state, action) => {
      state.userList.push(action.payload);
    },
    setUserPostState: (state, action) => {
      state.postState = action.payload;
    },
    setErrorType: (state, action) => {
      state.errorType = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.getState = 'fetching';
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.getState = 'ok';
        state.userList = action.payload as User[];
      })
      .addCase(getUsers.rejected, (state) => {
        state.getState = 'error';
        state.userList = [];
      })

      .addCase(postUser.pending, (state) => {
        state.postState = 'fetching';
      })
      .addCase(postUser.rejected, (state, action) => {
        // this condition is reached if API does not respond in time or connection is refused
        state.postState = 'error';
        state.errorType = 'Generic';
      })
      .addCase(removeUser.fulfilled, (state, action) => {
        state.userList = state.userList.filter((user) => user.id !== action.payload);
      });
  },
});

export const { addNewUser, setUserPostState, setErrorType } = userSlice.actions;

export const selectUserGetState = (state: RootState) => state.users.getState;
export const selectUserPostState = (state: RootState) => state.users.postState;
export const selectErrorType = (state: RootState) => state.users.errorType;
export const selectUsers = (state: RootState) => state.users.userList;

export default userSlice.reducer;
