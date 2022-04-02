import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from '@mui/material';
import { LockOpen } from '@mui/icons-material';
import styles from './Login.module.css';

import { authenticate, LoginCredentials, selectLoginState } from './loginSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { parseEmail } from '../../utils/parseEmail';

const Login = () => {
  const dispatch = useAppDispatch();
  const loginState = useAppSelector(selectLoginState);

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const validateInputs = ({ email, password }: LoginCredentials): boolean => {
    let firstCorrect = false,
      secondCorrect = false;
    if (email.length === 0) {
      setEmailError(`Field must be not empty`);
    } else if (!parseEmail(email)) {
      setEmailError(`Incorrect email format`);
    } else {
      setEmailError(null);
      firstCorrect = true;
    }

    if (password.length === 0) {
      setPasswordError(`Field must be not empty`);
    } else {
      setPasswordError(null);
      secondCorrect = true;
    }

    return firstCorrect && secondCorrect;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const authObj = {
      email: data.get('email') as string,
      password: data.get('password') as string,
    };

    if (validateInputs(authObj)) {
      dispatch(authenticate(authObj));
    }
  };

  if (loginState === 'ok') {
    return <Redirect to={'/'} />;
  }

  return (
    <main>
      <Container component="main" maxWidth="xs" className={styles.login}>
        <Box className={styles.loginBox}>
          <Avatar className={styles.loginLock}>
            <LockOpen />
          </Avatar>
          <Typography component="h1" variant="h5" align="center">
            Log in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            className={styles.loginFlexColumn}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              error={emailError !== null}
              helperText={emailError}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              error={passwordError !== null}
              helperText={passwordError}
            />
            {loginState === 'fetching' && (
              <div className={styles.loginInsideFlexCenter}>
                <CircularProgress />
              </div>
            )}
            {loginState !== 'fetching' && (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                className={styles.loginSignInButton}
              >
                Sign In
              </Button>
            )}

            {loginState === 'error' && (
              <div className={styles.loginError}>Login failed; Invalid username or password</div>
            )}
          </Box>
        </Box>
      </Container>
    </main>
  );
};

export default Login;
