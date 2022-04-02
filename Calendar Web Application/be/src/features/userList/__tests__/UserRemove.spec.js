import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import api from '../../../app/api';
import * as moxios from 'moxios';
import { removeUser, userSlice } from '../usersSlice';

let store = null;
let dispatch = null;

const initialState = {
  userList: [{ email: 'mattbrook@gmail.com', userName: 'Matt Brook', id: 1 }],
  status: 'default',
};

describe('Users tests', () => {
  beforeAll(() => {
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
  });

  beforeEach(() => {
    moxios.install(api);
  });

  afterEach(() => {
    moxios.uninstall(api);
  });

  describe('async thunk remove user request', () => {
    it('userDeletion_ok', async () => {
      moxios.wait(() => {
        moxios.requests.mostRecent().respondWith({
          status: 200,
          response: {},
        });
      });
      const expectedStore = {
        users: {
          status: 'default',
          userList: [],
        },
      };

      await removeUser(1)(dispatch);
      expect(store.getState()).toEqual(expectedStore);
    });

    it('userDeletion_incorrectId', async () => {
      moxios.wait(() => {
        moxios.requests.mostRecent().respondWith({
          status: 200,
          response: {},
        });
      });
      const expectedStore = store.getState();

      await removeUser(-1)(dispatch);
      expect(store.getState()).toEqual(expectedStore);
    });
  });
});
