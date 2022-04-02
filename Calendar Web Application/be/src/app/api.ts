import axios from 'axios';
import { deleteCookie, getCookieValue } from '../utils/cookieManager';
import { LoginUserCookie } from '../features/login/loginSlice';

const api = axios.create({
  baseURL: `${process.env.REACT_APP_SERVER_ADDRESS}`,
  timeout: Number(process.env.REACT_APP_REQUEST_TIME_OUT),
});

api.interceptors.request.use(
  (config) => {
    let userData = getCookieValue<LoginUserCookie | null>('user');
    if (userData) {
      config.headers = {
        LoginFlag: userData.token,
      };
    }
    return config;
  },
  (onRequestError) => {
    return Promise.reject(onRequestError);
  },
);

api.interceptors.response.use(
  (resp) => resp,
  (err) => {
    const { response } = err;
    if (response.status === 401) {
      deleteCookie('user');
      if (window.location.pathname !== '/login') {
        window.location.pathname = '/login';
      }
    }
    return Promise.reject(err);
  },
);

export default api;
