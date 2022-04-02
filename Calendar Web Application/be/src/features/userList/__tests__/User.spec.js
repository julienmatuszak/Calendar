import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import api from '../../../app/api';
import * as moxios from 'moxios';

import { getUsers, postUser, userSlice } from '../usersSlice';
import { validGetUsersResponse } from '../constants/validGetUsersResponse';
import { existingUserPostResponse } from '../constants/existingUserPostResponse';
import { existingEmailPostResponse } from '../constants/existingEmailPostReponse';

const initialState = {
  userList: [],
  getState: 'default',
  postState: 'default',
  errorType: 'none',
};

let store = null;
let dispatch = null;

describe('userSlice', () => {
  beforeEach(() => {
    store = configureStore({
      reducer: {
        users: userSlice.reducer,
      },
      preloadedState: {
        users: initialState,
      },
      middleware: [thunk],
    });

    dispatch = store.dispatch;

    moxios.install(api);
  });

  afterEach(() => {
    moxios.uninstall(api);
  });

  describe('getUsers async thunk', () => {
    it('should return a user list', async () => {
      moxios.wait(() => {
        moxios.requests.mostRecent().respondWith({
          status: 200,
          response: validGetUsersResponse.data,
        });
      });

      const expectedStore = {
        users: {
          userList: validGetUsersResponse.data,
          getState: 'ok',
          postState: 'default',
          errorType: 'none',
        },
      };

      await getUsers()(dispatch);
      expect(store.getState()).toEqual(expectedStore);
    });
  });

  describe('postUser async thunk', () => {
    it('should return a new user id', async () => {
      moxios.wait(() => {
        moxios.requests.mostRecent().respondWith({
          status: 201,
          response: 1,
        });
      });

      const newUser = {
        id: -1,
        userName: 'Matt Brook',
        email: 'mattbrook@gmail.com',
      };

      const expectedStore = {
        users: {
          userList: [{ id: 1, userName: 'Matt Brook', email: 'mattbrook@gmail.com' }],
          getState: 'default',
          postState: 'ok',
          errorType: 'none',
        },
      };

      await postUser(newUser)(dispatch);
      expect(store.getState()).toEqual(expectedStore);
    });

    it('should return a 409 when user name exists', async () => {
      moxios.wait(() => {
        moxios.requests.mostRecent().respondWith({
          status: 409,
          response: existingUserPostResponse.data,
        });
      });

      const newUser = {
        id: -1,
        userName: 'Matt Brook',
        email: 'mattbrook@gmail.com',
      };

      const expectedStore = {
        users: {
          userList: [],
          getState: 'default',
          postState: 'error',
          errorType: 'UserNameExists',
        },
      };

      await postUser(newUser)(dispatch);
      expect(store.getState()).toEqual(expectedStore);
    });

    it('should return a 409 when email exists', async () => {
      moxios.wait(() => {
        moxios.requests.mostRecent().respondWith({
          status: 409,
          response: existingEmailPostResponse.data,
        });
      });

      const newUser = {
        id: -1,
        userName: 'Matt Brook',
        email: 'mattbrook@gmail.com',
      };

      const expectedStore = {
        users: {
          userList: [],
          getState: 'default',
          postState: 'error',
          errorType: 'EmailExists',
        },
      };

      await postUser(newUser)(dispatch);
      expect(store.getState()).toEqual(expectedStore);
    });

    it('should set a Generic error when server is down', async () => {
      moxios.wait(() => {
        moxios.requests.mostRecent().reject();
      });

      const newUser = {
        id: -1,
        userName: 'Matt Brook',
        email: 'mattbrook@gmail.com',
      };

      const expectedStore = {
        users: {
          userList: [],
          getState: 'default',
          postState: 'error',
          errorType: 'Generic',
        },
      };

      await postUser(newUser)(dispatch);
      expect(store.getState()).toEqual(expectedStore);
    });
  });
});
