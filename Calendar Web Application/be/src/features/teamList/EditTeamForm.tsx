import React, { Dispatch, useEffect, SetStateAction } from 'react';
import TextField from '@mui/material/TextField';
import Multiselect from 'multiselect-react-dropdown';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getUsers, selectUserGetState, selectUsers, User } from '../userList/usersSlice';
import StyledDeclineButton from '../../components/styledDeclineButton/StyledDeclineButton';
import StyledConfirmButton from '../../components/styledConfirmButton/StyledConfirmButton';
import {
  updateTeam,
  selectTeamUpdateState,
  setUpdateStatus,
  selectTeamErrorState,
  selectDuplicateUsers,
  Team,
} from './teamsSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toastContainerProps } from '../../app/toastifyConfig';
import { Box, Modal, Typography } from '@mui/material';
import { createOptions } from './createOptions';

export default function EditTeamForm({
  id,
  name,
  teamUsers,
  open,
  setOpen,
}: {
  id: number | undefined;
  name: string;
  teamUsers: User[];
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [teamName, setTeamName] = React.useState(name);
  const [teamNameError, setTeamNameError] = React.useState('');
  const [userDuplicateError, setUserDuplicateError] = React.useState('');
  const [teamMembers, setTeamMembers] = React.useState<User[]>(teamUsers);

  const appDispatch = useAppDispatch();
  const userRetrievalState = useAppSelector(selectUserGetState);
  const users = useAppSelector(selectUsers);
  const teamUpdateState = useAppSelector(selectTeamUpdateState);
  const teamErrors = useAppSelector(selectTeamErrorState);
  const duplicateUsers = useAppSelector(selectDuplicateUsers);

  useEffect(() => {
    appDispatch(getUsers());
  }, [appDispatch]);

  // teamUpdateState signals PUT request effects on the Modal state
  // teamErrorState PUT error type
  useEffect(() => {
    // clean errors
    setTeamNameError('');
    setUserDuplicateError('');
    if (teamUpdateState === 'ok') {
      setTeamNameError('');
      setUserDuplicateError('');
      setOpen(false);
    } else if (teamUpdateState === 'error') {
      if (teamErrors === 'TeamExists') {
        setTeamNameError('Team with this name exists');
      } else if (teamErrors === 'UserInAnotherTeam') {
        setUserDuplicateError(
          `Following user${
            duplicateUsers.length === 1 ? ' is' : 's are'
          } already assigned to another team: ${duplicateUsers.join(', ')}`,
        );
      } else if (teamErrors === 'TeamNotFound') {
        setTeamNameError('Team was not found');
      } else if (teamErrors === 'Generic') {
        toast.warn('Server error', { containerId: 'update-team-form' });
      }
    }
  }, [teamUpdateState, teamErrors, duplicateUsers, setOpen]);

  const handleClose = () => {
    setTeamName(name);
    setTeamMembers(teamUsers);
    setTeamNameError('');
    setUserDuplicateError('');
    appDispatch(setUpdateStatus('default'));
    setOpen(false);
  };

  const handleSave = () => {
    let valid = true;
    if (teamNameError !== '') {
      valid = false;
    }
    if (teamName.length === 0) {
      setTeamNameError('Team name can not be empty');
      valid = false;
    }
    //If nothing was changed do not make API call
    if (teamName === name && teamMembers === teamUsers) {
      valid = false;
      setOpen(false);
    }
    if (valid) {
      const newTeam: Team = {
        id: id,
        teamName: teamName,
        users: teamMembers,
      };
      appDispatch(updateTeam(newTeam));
    }
  };

  const handleTeamNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let text = e.target.value;
    if (text.length < 3) {
      setTeamNameError('Team name should be 3 symbols or more');
    }
    if (text.length >= 3) {
      setTeamNameError('');
    }
    if (text.length > 100) {
      text = text.substring(0, 100);
    }
    setTeamName(text);
  };

  const onSelect = (selectedList: { id: number; key: string }[]) => {
    const selectedIds = selectedList.map((user) => user.id);
    const userList = users.filter((user: User) => selectedIds.includes(user.id));
    setUserDuplicateError('');
    setTeamMembers(userList);
  };

  let placeholderText = '';
  if (userRetrievalState === 'ok') {
    placeholderText = 'Click to select users';
  } else if (userRetrievalState === 'error') {
    placeholderText = 'Something went wrong.';
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{
        '& .MuiPaper-root': {
          overflowY: 'visible',
        },
      }}
    >
      <>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            borderRadius: 1,
            boxShadow: 24,
          }}
        >
          <Box
            sx={{
              width: '100%',
              padding: '16px 24px 16px 24px',
            }}
          >
            <Typography
              sx={{
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '16px',
                letterSpacing: 0.15,
              }}
            >
              Editing team
            </Typography>
          </Box>
          <Box
            sx={{
              width: '100%',
              padding: '0px 24px 0px 24px',
              overflowY: 'visible',
              fontFamily: 'Roboto',
              fontStyle: 'normal',
              fontWeight: 'normal',
              fontSize: '16px',
              lineHeight: '24px',
              letterSpacing: '0.15px',
            }}
          >
            <TextField
              sx={{
                '& .MuiFormLabel-root': {
                  fontFamily: 'Roboto',
                  fontStyle: 'normal',
                  fontWeight: 'normal',
                  fontSize: '12px',
                  lineHeight: '16px',
                  letterSpacing: '0.4px',
                  color: '#404cfa',
                },
                '& .MuiFilledInput-root': {
                  fontFamily: 'Roboto',
                  fontStyle: 'normal',
                  fontWeight: 'normal',
                  fontSize: '16px',
                  lineHeight: '24px',
                  letterSpacing: '0.15px',
                },
              }}
              autoFocus
              value={teamName}
              error={teamNameError !== ''}
              helperText={teamNameError}
              margin="dense"
              id="teamName"
              label="Name"
              fullWidth
              variant="filled"
              onChange={handleTeamNameChange}
            />
            <div className="add-team-form__user-selection-container">
              <Multiselect
                avoidHighlightFirstOption
                emptyRecordMsg="No more users available"
                displayValue="key"
                placeholder={placeholderText}
                onRemove={onSelect}
                onSelect={onSelect}
                options={createOptions(users)}
                closeOnSelect={false}
                selectedValues={createOptions(teamUsers)}
              />
              <div className="add-team-form__user-selection-container-error">
                {userDuplicateError}
              </div>
            </div>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              padding: '24px',
            }}
          >
            <StyledDeclineButton sx={{ marginRight: '16px' }} onClick={handleClose}>
              Cancel
            </StyledDeclineButton>
            <StyledConfirmButton onClick={handleSave}>Save</StyledConfirmButton>
          </Box>
        </Box>
        <ToastContainer {...toastContainerProps} containerId={'update-team-form'} />
      </>
    </Modal>
  );
}
