import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import loginReducer from '../features/login/loginSlice';
import timeOffTypeReducer from '../features/timeOffTypes/timeOffTypesSlice';
import userReducer from '../features/userList/usersSlice';
import teamReducer from '../features/teamList/teamsSlice';
import calendarReducer from '../features/calendar/calendarSlice';

export const store = configureStore({
  reducer: {
    login: loginReducer,
    timeOffTypes: timeOffTypeReducer,
    users: userReducer,
    teams: teamReducer,
    calendar: calendarReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
