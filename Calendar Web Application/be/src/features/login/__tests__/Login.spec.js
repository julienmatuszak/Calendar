import { authenticate, loginCheck, loginSlice } from '../loginSlice';
import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import { addCookie } from '../../../utils/cookieManager';
import api from '../../../app/api';
import * as moxios from 'moxios';

let store = null;
let dispatch = null;

describe('Login tests', () => {
  beforeEach(() => {
    store = configureStore({
      reducer: {
        login: loginSlice.reducer,
      },
      middleware: [thunk],
    });

    dispatch = store.dispatch;

    moxios.install(api);
  });

  afterEach(() => {
    moxios.uninstall(api);
  });

  describe('async thunk login', () => {
    it('loginFulfilled_goodResponse', async () => {
      moxios.wait(() => {
        moxios.requests.mostRecent().respondWith({
          status: 200,
          response: { userName: 'a', roles: [], token: 'token', userId: 11 },
        });
      });
      const expectedStore = {
        login: {
          roles: [],
          status: 'ok',
          userName: 'a',
          userId: 11,
        },
      };

      await authenticate({ email: 'e', password: '' })(dispatch);
      expect(store.getState()).toEqual(expectedStore);
    });

    it('loginFulfilled_incorrectResponse', async () => {
      const expectedStore = {
        login: {
          roles: [],
          status: 'error',
          userName: '',
          userId: -1,
        },
      };

      moxios.stubOnce('post', '/login', {
        status: 200,
        response: { userName: '', roles: [] },
      });
      await authenticate({ email: 'e', password: '' })(dispatch);

      expect(store.getState()).toEqual(expectedStore);
    });

    it('loginRejected_403statusResponse', async () => {
      const expectedStore = {
        login: {
          roles: [],
          status: 'error',
          userName: '',
          userId: -1,
        },
      };

      moxios.stubOnce('post', '/login', {
        status: 403,
        response: {},
      });

      await authenticate({ email: 'e', password: '' })(dispatch);
      expect(store.getState()).toEqual(expectedStore);
    });
  });

  describe('Login Cookie test', () => {
    it('correctCookiePresent', async () => {
      const expectedStore = {
        login: {
          roles: ['any'],
          status: 'ok',
          userName: 'userName',
          userId: 1,
        },
      };

      addCookie('user', { userName: 'userName', roles: ['any'], userId: 1 }, 10);
      dispatch(loginCheck());

      expect(store.getState()).toEqual(expectedStore);
    });

    it('emptyCookie', () => {
      const expectedStore = {
        login: {
          roles: [],
          status: 'default',
          userName: '',
          userId: -1,
        },
      };

      addCookie('user', { userName: '', roles: [] }, 10);
      dispatch(loginCheck());

      expect(store.getState()).toEqual(expectedStore);
    });

    it('noCookie', () => {
      const expectedStore = {
        login: {
          roles: [],
          status: 'default',
          userName: '',
          userId: -1,
        },
      };

      dispatch(loginCheck());
      expect(store.getState()).toEqual(expectedStore);
    });
  });
});
