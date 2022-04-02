import { useState } from 'react';
import { useAppDispatch } from '../../app/hooks';
import { deleteTeam } from './teamsSlice';
import { ReactComponent as TrashBinIcon } from '../../resources/discard.svg';
import { Dialog, Typography } from '@mui/material';
import StyledDeclineButton from '../../components/styledDeclineButton/StyledDeclineButton';
import StyledConfirmButton from '../../components/styledConfirmButton/StyledConfirmButton';
import './removeTeamIcon.css';

interface RemoveTeamIconProps {
  teamId: number;
  teamName: string;
  assignedMembers: number;
}

export const RemoveTeamIcon = ({ teamId, teamName, assignedMembers }: RemoveTeamIconProps) => {
  const [isDialogOpen, setDialogOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const handleClick = (e: any) => {
    dispatch(deleteTeam(teamId));
    setDialogOpen(false);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <TrashBinIcon onClick={() => setDialogOpen(true)} />
      <Dialog
        sx={{
          '& .MuiPaper-root': {
            padding: '16px 24px 16px 24px',
          },
        }}
        onClose={handleCloseDialog}
        open={isDialogOpen}
        className={'remove_team_dialog'}
      >
        <Typography
          sx={{
            fontFamily: 'Poppins',
            fontStyle: 'normal',
            fontWeight: 600,
            fontSize: '16px',
            letterSpacing: 0.15,
            marginBottom: '16px',
          }}
        >
          {`Are you sure you want to delete team ${teamName}?`}
        </Typography>
        {assignedMembers !== 0 && (
          <div className="remove_team_dialog-warning">
            It has {assignedMembers} member(s) assigned
          </div>
        )}
        <div className="remove_team_dialog-buttons">
          <StyledDeclineButton onClick={handleCloseDialog}>Cancel</StyledDeclineButton>
          <StyledConfirmButton onClick={handleClick} sx={{ marginLeft: '20px' }}>
            Delete
          </StyledConfirmButton>
        </div>
      </Dialog>
    </>
  );
};
