import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getUsers, selectUsers, selectUserGetState } from './usersSlice';

import './userList.css';
import RemoveUserIcon from './removeUserIcon/RemoveUserIcon';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { getTeams, selectTeamGetState } from '../teamList/teamsSlice';
import AddUserForm from './AddUserForm';
import StyledHeader from './../../components/styledHeader/StyledHeader';
import { selectUserId } from '../login/loginSlice';

const UserList = () => {
  const appDispatch = useAppDispatch();
  const userRetrievalState = useAppSelector(selectUserGetState);
  const users = useAppSelector(selectUsers);
  const userId = useAppSelector(selectUserId);

  const teamsGetStatus = useAppSelector(selectTeamGetState);
  if (teamsGetStatus === 'default') appDispatch(getTeams());

  useEffect(() => {
    appDispatch(getUsers());
  }, [appDispatch]);

  let rows;
  if (users.length !== 0) {
    rows = users.map((user) => (
      <TableRow
        className="user-list__table-row"
        key={user.id}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell>{user.userName}</TableCell>
        <TableCell align="left">{user.email}</TableCell>
        <TableCell align="center">
          {userId !== user.id ? <RemoveUserIcon userId={user.id} /> : null}
        </TableCell>
      </TableRow>
    ));
  } else {
    rows = (
      <TableRow
        className="user-list__table-row"
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell scope="row">No users</TableCell>
      </TableRow>
    );
  }

  return (
    <div className="user-list">
      <StyledHeader>User List</StyledHeader>
      <div className="user-list__add-user-button-container">
        <AddUserForm />
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 608, border: 'solid 1px #21212120' }} className="user-list__table">
          <TableHead>
            <TableRow className="user-list__table-row">
              <TableCell> User </TableCell>
              <TableCell> Email </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>{userRetrievalState === 'ok' && rows}</TableBody>
          <TableBody>
            {userRetrievalState === 'error' && (
              <TableRow>
                <TableCell scope="row"> Something went wrong! Please reload </TableCell>
                <TableCell />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default UserList;
