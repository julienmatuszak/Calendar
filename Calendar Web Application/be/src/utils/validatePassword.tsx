/*
  Test password strength. Must contain:
   - 1+ lowercase alphabetical
   - 1+ uppercase alphabetical
   - 1+ numeric
   - 8+ characters long
   */
export const validatePassword = (password: string): boolean => {
  let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
  return regex.test(password);
};
