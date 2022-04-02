import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getTeams, selectTeams, selectTeamGetState } from './teamsSlice';
import AddTeamForm from './AddTeamForm';
import { createOptions } from './createOptions';
import './teamList.css';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import ClickableTableCell from './ClickableTableCell';
import { RemoveTeamIcon } from './RemoveTeamIcon';
import StyledHeader from './../../components/styledHeader/StyledHeader';

const TeamList = () => {
  const appDispatch = useAppDispatch();
  const teamRetrievalState = useAppSelector(selectTeamGetState);
  const teams = useAppSelector(selectTeams);

  useEffect(() => {
    appDispatch(getTeams());
  }, [appDispatch]);

  let rows;
  if (teams.length !== 0) {
    rows = teams.map((team) => {
      let members = createOptions(team.users)
        .map((member) => member.key)
        .join(', ');
      if (members === '') {
        members = 'No team members';
      }
      return (
        <TableRow
          className="team-list__table-row"
          key={team.id}
          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
          <ClickableTableCell id={team.id} name={team.teamName} users={team.users} />
          <TableCell>{members}</TableCell>
          <TableCell>
            <RemoveTeamIcon
              teamId={team.id!}
              teamName={team.teamName}
              assignedMembers={team.users.length}
            />
          </TableCell>
        </TableRow>
      );
    });
  } else {
    rows = (
      <TableRow
        className="team-list__table-row"
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell scope="row">No teams</TableCell>
      </TableRow>
    );
  }

  return (
    <div className="team-list">
      <StyledHeader>Team List</StyledHeader>
      <div className="team-list__add-team-button-container">
        <AddTeamForm />
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 608, border: 'solid 1px #21212120' }} className="team-list__table">
          <TableHead>
            <TableRow className="team-list__table-row">
              <TableCell> Team </TableCell>
              <TableCell> Members </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>{teamRetrievalState === 'ok' && rows}</TableBody>
          <TableBody>
            {teamRetrievalState === 'error' && (
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

export default TeamList;
