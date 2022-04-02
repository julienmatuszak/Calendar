import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { authenticateBe } from './loginApi';
import { addCookie, getCookieValue } from '../../utils/cookieManager';

export interface LoginState {
  userName: string;
  roles: string[];
  status: 'default' | 'fetching' | 'error' | 'ok';
  userId: number;
}

export const initialState: LoginState = {
  userName: '',
  roles: [],
  status: 'default',
  userId: -1,
};

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginUserCookie {
  userName: string;
  roles: string[];
  token: string;
  userId: number;
}

export const authenticate = createAsyncThunk<LoginState, LoginCredentials>(
  'login/userLogin',
  async (credentials: LoginCredentials) => {
    const response = await authenticateBe(credentials);
    // const response = await authenticateMock(credentials);
    if (response.status === 200) {
      const { userName, roles, token, userId } = response.data as LoginUserCookie;
      if (userName && token && userId) {
        addCookie<LoginUserCookie>('user', { userName, roles, token, userId }, 10);
        return { userName, roles, status: 'ok', userId };
      }
    }
    return { userName: '', roles: [], status: 'error', userId: -1 };
  },
);

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setLoginState: (state, action: PayloadAction<LoginState>) => {
      const { userName, roles, status, userId } = action.payload;
      state.userName = userName;
      state.roles = roles;
      state.status = status;
      state.userId = userId;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(authenticate.pending, (state) => {
        state.status = 'fetching';
      })
      .addCase(authenticate.fulfilled, (state, action: PayloadAction<LoginState>) => {
        const { userName, roles, status, userId } = action.payload;
        state.userName = userName;
        state.roles = roles;
        state.status = status;
        state.userId = userId;
      })
      .addCase(authenticate.rejected, (state, action) => {
        state.status = 'error';
        state.userName = '';
        state.userId = -1;
        state.roles = [];
      });
  },
});

export const loginCheck = () => (dispatch: any, getStore: any) => {
  const userCookie = getCookieValue<LoginUserCookie | null>('user');
  const { setLoginState } = loginSlice.actions;
  if (userCookie != null && typeof userCookie === 'object') {
    const { userName, roles, userId } = userCookie;
    if (userName && userId > 0) {
      dispatch(setLoginState({ userName, roles, status: 'ok', userId }));
      return;
    }
  }
  dispatch(setLoginState({ userName: '', roles: [], status: 'default', userId: -1 }));
};

export const { setLoginState } = loginSlice.actions;

export const selectLoginState = (state: RootState) => state.login.status;
export const selectUserId = (state: RootState) => state.login.userId;
export const selectLoggedInUser = (state: RootState) => state.login.userName;

export default loginSlice.reducer;
