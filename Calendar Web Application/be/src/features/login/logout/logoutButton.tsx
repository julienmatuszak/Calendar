import { IconButton } from '@mui/material';
import { useAppDispatch } from '../../../app/hooks';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from 'react-router-dom';
import { deleteCookie } from '../../../utils/cookieManager';
import { setLoginState } from '../loginSlice';
import './logoutButton.css';

export const LogoutButton = () => {
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(setLoginState({ userName: '', roles: [], status: 'default', userId: -1 }));
    deleteCookie('user');
    window.location.pathname = '/';
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          '&:hover': {
            backgroundColor: 'white',
          },
          margin: '8px',
          background: '#d9dbfe',
        }}
      >
        <LogoutIcon className="logout-button" />
        <Link to="/login" />
      </IconButton>
    </>
  );
};
