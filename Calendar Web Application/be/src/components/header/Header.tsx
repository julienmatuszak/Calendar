import React from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as AvailabilityTrackerIcon } from '../../resources/availability-tracker.svg';
import './header.css';
import { LogoutButton } from '../../features/login/logout/logoutButton';
import { useAppSelector } from '../../app/hooks';
import { selectLoggedInUser } from '../../features/login/loginSlice';

export const Header = () => {
  const loggedInUser = useAppSelector(selectLoggedInUser);

  return (
    <div className="header">
      <Link className="availability-tracker" to="/">
        <div className="availability-tracker__icon">
          <AvailabilityTrackerIcon />
        </div>
        <div className="availability-tracker__text">Availability Tracker</div>
      </Link>
      <div className="login-container">
        <div className="login-container__logged-in-user"> {loggedInUser} </div>
        <LogoutButton />
      </div>
    </div>
  );
};
