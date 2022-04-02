import { User } from '../userList/usersSlice';

/**
 * Create options object representing the users by their userName and id in MultiSelectDropDown.
 * Make userNames unique by appending a number of repetitions. Needed because MultiSelectDropdown
 * has a selection issue when many users have the same name.
 * @param users User[]
 * @return userPool {id: number, key: string}[]
 */
export const createOptions = (users: User[]) => {
  let repetitions: { [userName: string]: number } = {};
  return users.map((user) => {
    repetitions[user.userName] = (repetitions[user.userName] || 0) + 1;
    const count = repetitions[user.userName];
    return {
      id: user.id,
      key: user.userName + (count !== 1 ? ` (${count - 1})` : ''),
    };
  });
};
