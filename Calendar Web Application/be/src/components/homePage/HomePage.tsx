import React, { useEffect } from 'react';
import TimeOffTypes from '../../features/timeOffTypes/TimeOffTypes';
import Calendar from '../../features/calendar/Calendar';
import './HomePage.css';
import StyledHeader from '../styledHeader/StyledHeader';
import { fillCalendarGroups, selectTeamName } from '../../features/calendar/calendarSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getTimeOffTypes } from '../../features/timeOffTypes/timeOffTypesSlice';

export default function HomePage() {
  let teamName = useAppSelector(selectTeamName);
  const noTeam = 'You are not assigned to any team';
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getTimeOffTypes());
    dispatch(fillCalendarGroups());
  }, [dispatch]);

  return (
    <div className="home_page">
      <StyledHeader>{teamName ? teamName : noTeam}</StyledHeader>
      <div className="time_off_types">{teamName && <TimeOffTypes />}</div>
      <div className="calendar">{teamName && <Calendar />}</div>
    </div>
  );
}
