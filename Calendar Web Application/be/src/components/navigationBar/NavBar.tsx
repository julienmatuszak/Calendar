import { Link } from 'react-router-dom';
import { ReactComponent as AddTimeOffIcon } from '../../resources/add-time-off.svg';
import { ReactComponent as ManageTeamIcon } from '../../resources/manage-users.svg';
import { ReactComponent as ManageUserIcon } from '../../resources/manage-users.svg';
import './navBar.css';
import { useHistory } from 'react-router-dom';

import { useAppDispatch } from '../../app/hooks';
import { setIsAddTimeOffModalOpen } from '../../features/calendar/calendarSlice';

const NavBar = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();

  const handleOpenAddTimeOffForm = () => {
    dispatch(setIsAddTimeOffModalOpen(true));
    history.push('/');
  };

  return (
    <>
      <div className="nav-bar">
        <div className="add-time-off-button" onClick={handleOpenAddTimeOffForm}>
          <div className="add-time-off-button__icon">
            <AddTimeOffIcon />
          </div>
          Add time off
        </div>
        <div className="manage-users-button">
          <Link to="/manage-users">
            <div className="manage-users-button__icon">
              <ManageTeamIcon />
            </div>
            Manage Users
          </Link>
        </div>
        <div className="manage-teams-button">
          <Link to="/manage-teams">
            <div className="manage-teams-button__icon">
              <ManageUserIcon />
            </div>
            Manage Teams
          </Link>
        </div>
      </div>
    </>
  );
};

export default NavBar;
