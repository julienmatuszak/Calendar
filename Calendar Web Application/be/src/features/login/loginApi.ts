import { LoginCredentials } from './loginSlice';
import api from '../../app/api';

export function authenticateBe(credentials: LoginCredentials) {
  return api.post('/login', credentials);
}

interface Resp {
  status: number;
  data: object;
}

export function authenticateMock(credentials: LoginCredentials) {
  return new Promise<Resp>((resolve, reject) => {
    if (Math.random() > 0.5) {
      setTimeout(
        () =>
          resolve({
            status: 200,
            data: { userName: 'UserMock', roles: [], token: 'e65bes6V4AEGf' },
          }),
        500,
      );
    } else {
      setTimeout(() => reject('out of luck '), 500);
    }
  });
}
