import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { loginCheck, selectLoginState } from '../../features/login/loginSlice';
import { Route } from 'react-router-dom';
import AuthenticatedPageLayout from '../authenticatedPageLayout/AuthenticatedPageLayout';
import { useEffect } from 'react';
import Login from '../../features/login/Login';

const AuthenticatedPath = (props: any) => {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(selectLoginState) === 'ok';

  useEffect(() => {
    dispatch(loginCheck());
    // eslint-disable-next-line
  }, [props.path]);

  if (isLoggedIn) {
    return (
      <AuthenticatedPageLayout>
        <Route {...props} />
      </AuthenticatedPageLayout>
    );
  } else {
    return <Login />;
  }
};

export default AuthenticatedPath;
