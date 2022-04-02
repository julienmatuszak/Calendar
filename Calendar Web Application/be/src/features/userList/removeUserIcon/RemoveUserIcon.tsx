import { ReactComponent as TrashBinIcon } from '../../../resources/discard.svg';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { removeUser } from '../usersSlice';
import { Dialog, Typography } from '@mui/material';
import { useState } from 'react';
import styles from './RemoveUserIcon.module.css';
import StyledConfirmButton from '../../../components/styledConfirmButton/StyledConfirmButton';
import StyledDeclineButton from '../../../components/styledDeclineButton/StyledDeclineButton';
import { selectTeams, Team } from '../../teamList/teamsSlice';

const formDialogText = (teams: Team[], userId: number) => {
  for (let team of teams) {
    for (let user of team?.users) {
      if (userId === user.id) {
        return (
          <>
            User assigned to team <b>{team.teamName}</b>,<br /> are you sure you want to delete?
          </>
        );
      }
    }
  }
  return <>Are you sure you want to delete this user?</>;
};

const RemoveUserIcon = ({ userId }: { userId: number }) => {
  const [isDialogOpen, setDialogOpen] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const handleClick = (e: any) => {
    dispatch(removeUser(userId));
    setDialogOpen(false);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const dialogText = formDialogText(useAppSelector(selectTeams), userId);

  return (
    <>
      <TrashBinIcon onClick={() => setDialogOpen(true)} />
      <Dialog onClose={handleCloseDialog} open={isDialogOpen} className={styles.remove_user_dialog}>
        <Typography sx={{ margin: '20px 20px 0px 20px' }}>{dialogText}</Typography>
        <div>
          <StyledConfirmButton onClick={handleClick} sx={{ margin: '16px 24px 16px 24px' }}>
            Delete
          </StyledConfirmButton>
          <StyledDeclineButton
            onClick={handleCloseDialog}
            sx={{
              margin: '16px 0px 16px 0px',
            }}
          >
            Cancel
          </StyledDeclineButton>
        </div>
      </Dialog>
    </>
  );
};

export default RemoveUserIcon;
