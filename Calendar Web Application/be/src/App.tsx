import React from 'react';
import './resources/fonts/fonts.css';
import './App.css';

import { Route, Switch } from 'react-router-dom';

import Login from './features/login/Login';
import UserList from './features/userList/userList';
import AuthenticatedPath from './components/authenticatedPath/AuthenticatedPath';
import TeamList from './features/teamList/teamList';
import HomePage from './components/homePage/HomePage';
import { ToastContainer } from 'react-toastify';
import { toastContainerProps } from './app/toastifyConfig';
import 'react-toastify/dist/ReactToastify.css';

const App = () => (
  <>
    <Switch>
      <Route path={'/login'} children={<Login />} />
      <AuthenticatedPath exact path={'/'} children={<HomePage />} />
      <AuthenticatedPath path={'/manage-users'} children={<UserList />} />
      <AuthenticatedPath path={'/manage-teams'} children={<TeamList />} />
      <Route path={'*'} children={<h1> Page not found </h1>} />
    </Switch>
    <ToastContainer {...toastContainerProps} containerId="main-toast-container" />
  </>
);

export default App;
