import React, { useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  postUser,
  selectErrorType,
  selectUserPostState,
  setUserPostState,
  User,
} from './usersSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toastContainerProps } from '../../app/toastifyConfig';
import StyledDeclineButton from '../../components/styledDeclineButton/StyledDeclineButton';
import StyledConfirmButton from '../../components/styledConfirmButton/StyledConfirmButton';
import StyledAddButton from '../../components/styledAddButton/StyledAddButton';
import { parseEmail } from '../../utils/parseEmail';
import { textFieldStyles } from './styles';
import { validatePassword } from '../../utils/validatePassword';

export default function AddUserForm() {
  const [open, setOpen] = React.useState(false);
  const [userName, setUserName] = React.useState('');
  const [userNameError, setUserNameError] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [emailError, setEmailError] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');

  const appDispatch = useAppDispatch();
  const userPostState = useAppSelector(selectUserPostState);
  const userErrorType = useAppSelector(selectErrorType);

  // userPostState signals POST request effects on the Dialog state
  useEffect(() => {
    cleanErrors();
    if (userPostState === 'ok') {
      onSuccessfulPost();
    } else if (userPostState === 'error') {
      if (userErrorType === 'UserNameExists') {
        setUserNameError('User name exists in the database');
      } else if (userErrorType === 'EmailExists') {
        setEmailError('Another user with the same email address exists in the application');
      } else if (userErrorType === 'Generic') {
        toast.warn('Server error', { containerId: 'add-user-form' });
      }
    }
  }, [userPostState, userErrorType]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const cleanFieldContents = () => {
    setUserName('');
    setEmail('');
    setPassword('');
  };

  const handleClose = () => {
    cleanFieldContents();
    cleanErrors();
    appDispatch(setUserPostState('default'));
    setOpen(false);
  };

  const handleSave = () => {
    let valid = true;

    // invalidate if there are errors from TextField change callbacks
    if (userNameError !== '' || emailError !== '') {
      valid = false;
    }

    // invalidate if the are errors on submit
    if (userName.length === 0) {
      setUserNameError('User name can not be empty');
      valid = false;
    }
    if (email.length === 0) {
      setEmailError('Email can not be empty');
      valid = false;
    }
    if (!parseEmail(email)) {
      setEmailError('Please enter a valid email address');
      valid = false;
    }
    if (password.length === 0) {
      setPasswordError('Password can not be empty');
      valid = false;
    }

    if (valid) {
      const newUser: User = {
        id: -1,
        userName: userName,
        email: email,
        password: password,
      };
      appDispatch(postUser(newUser));
    }
  };

  const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let text = e.target.value;
    if (text.length < 3) {
      setUserNameError('User name should be 3 symbols or more');
    }
    if (text.length >= 3) {
      setUserNameError('');
    }
    if (text.length > 100) {
      text = text.substring(0, 100);
    }
    setUserName(text);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let text = e.target.value;
    if (text.length < 5) {
      setEmailError('Email should be 5 symbols or more');
    }
    if (text.length >= 5) {
      setEmailError('');
    }
    if (text.length > 100) {
      text = text.substring(0, 100);
    }
    setEmail(text);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let text = e.target.value;
    if (!validatePassword(text)) {
      setPasswordError(
        'The password must be at least 8 symbols and contain at least one uppercase letter and a number',
      );
    } else {
      setPasswordError('');
    }
    setPassword(text);
  };

  const onSuccessfulPost = () => {
    setUserName('');
    setEmail('');
    setPassword('');
    setUserNameError('');
    setEmailError('');
    setPasswordError('');
    setOpen(false);
  };

  const cleanErrors = () => {
    setUserNameError('');
    setEmailError('');
    setPasswordError('');
  };

  return (
    <div>
      <StyledAddButton onClick={handleClickOpen}>Create New User</StyledAddButton>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          '& .MuiPaper-root': {
            overflowY: 'visible',
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: 'Poppins',
            fontStyle: 'normal',
            fontWeight: '600',
            fontSize: '16px',
            letterSpacing: '0.15px',
          }}
        >
          User Creation
        </DialogTitle>
        <DialogContent
          sx={{
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
              textFieldStyles,
            }}
            id="new-user-name"
            autoFocus
            value={userName}
            error={userNameError !== ''}
            helperText={userNameError}
            margin="dense"
            label="User Name"
            fullWidth
            variant="filled"
            onChange={handleUserNameChange}
          />
          <TextField
            sx={{
              textFieldStyles,
            }}
            id="new-email"
            value={email}
            error={emailError !== ''}
            helperText={emailError}
            margin="dense"
            label="Email"
            fullWidth
            variant="filled"
            onChange={handleEmailChange}
          />
          <TextField
            sx={{
              textFieldStyles,
            }}
            id="new-password"
            type="password"
            value={password}
            error={passwordError !== ''}
            helperText={passwordError}
            margin="dense"
            label="Password"
            fullWidth
            variant="filled"
            autoComplete="new-password"
            onChange={handlePasswordChange}
          />
        </DialogContent>
        <DialogActions
          sx={{
            padding: '0px 0px 0px 0px',
            margin: 'none',
          }}
        >
          <StyledDeclineButton
            sx={{
              margin: '0px 8px 24px 0px',
            }}
            onClick={handleClose}
          >
            {' '}
            Cancel{' '}
          </StyledDeclineButton>
          <StyledConfirmButton
            sx={{
              margin: '0px 24px 24px 8px',
            }}
            onClick={handleSave}
          >
            Save
          </StyledConfirmButton>
        </DialogActions>
        <ToastContainer {...toastContainerProps} containerId={'add-user-form'} />
      </Dialog>
    </div>
  );
}
