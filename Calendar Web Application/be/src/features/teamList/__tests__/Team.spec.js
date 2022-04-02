import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import api from '../../../app/api';
import * as moxios from 'moxios';
import { getTeams, postTeam, teamSlice, updateTeam } from '../teamsSlice';

// constants
import { mockUsers } from '../../userList/constants/validUsers.ts';
import { getTeamsResponse } from '../constants/validGetTeamsResponse';
import { validTeams } from '../constants/validTeams';
import { duplicateTeamNameResponse } from '../constants/duplicateTeamNamePostResponse';
import { duplicateUsersPostResponse } from '../constants/duplicateUsersPostResponse';

let store = null;
let dispatch = null;

const initialState = {
  teamList: [{ id: 0, teamName: 'Team Noname', users: mockUsers }],
  getStatus: 'default',
  postStatus: 'default',
  updateStatus: 'default',
  errorType: 'none',
  duplicateUsers: [],
};

describe('teamSlice', () => {
  beforeEach(() => {
    store = configureStore({
      reducer: {
        teams: teamSlice.reducer,
      },
      preloadedState: {
        teams: initialState,
      },
      middleware: [thunk],
    });

    dispatch = store.dispatch;

    moxios.install(api);
  });

  afterEach(() => {
    moxios.uninstall(api);
  });

  describe('getTeams async thunk', () => {
    it('should populate teamList with Teams objects', async () => {
      moxios.wait(() => {
        moxios.requests.mostRecent().respondWith({
          status: 200,
          response: getTeamsResponse.data,
        });
      });

      await getTeams()(dispatch);

      const expectedStore = {
        teams: {
          teamList: validTeams,
          getStatus: 'ok',
          postStatus: 'default',
          updateStatus: 'default',
          errorType: 'none',
          duplicateUsers: [],
        },
      };

      expect(store.getState()).toEqual(expectedStore);
    });
  });

  describe('postTeam async thunk', () => {
    it('should return a new team id', async () => {
      moxios.wait(() => {
        moxios.requests.mostRecent().respondWith({
          status: 201,
          response: 1,
        });
      });

      const newTeam = { teamName: 'Team Second', users: mockUsers };
      await postTeam(newTeam)(dispatch);

      const expectedStore = {
        teams: {
          teamList: [
            { id: 0, teamName: 'Team Noname', users: mockUsers },
            { id: 1, teamName: 'Team Second', users: mockUsers },
          ],
          getStatus: 'default',
          postStatus: 'ok',
          updateStatus: 'default',
          errorType: 'none',
          duplicateUsers: [],
        },
      };
      expect(store.getState()).toEqual(expectedStore);
    });

    it('should return 409 when duplicate team name', async () => {
      moxios.wait(() => {
        moxios.requests.mostRecent().respondWith({
          status: 409,
          response: duplicateTeamNameResponse.data,
        });
      });

      const newTeam = { teamName: 'Team Noname', users: mockUsers };
      await postTeam(newTeam)(dispatch);

      const expectedStore = {
        teams: {
          teamList: [{ id: 0, teamName: 'Team Noname', users: mockUsers }],
          getStatus: 'default',
          postStatus: 'error',
          updateStatus: 'default',
          errorType: 'TeamExists',
          duplicateUsers: [],
        },
      };
      expect(store.getState()).toEqual(expectedStore);
    });

    it('should return 409 when duplicate users selected', async () => {
      moxios.wait(() => {
        moxios.requests.mostRecent().respondWith({
          status: 409,
          response: duplicateUsersPostResponse.data,
        });
      });

      const newTeam = { teamName: 'Team Another Name', users: [] }; // expected duplicates are defined in duplicateUsersPostResponse, not here
      await postTeam(newTeam)(dispatch);

      const expectedStore = {
        teams: {
          teamList: [{ id: 0, teamName: 'Team Noname', users: mockUsers }],
          getStatus: 'default',
          postStatus: 'error',
          updateStatus: 'default',
          errorType: 'UserInAnotherTeam',
          duplicateUsers: ['Matt Brook', 'Conel McLane', 'John Smith'],
        },
      };
      expect(store.getState()).toEqual(expectedStore);
    });
  });

  describe('updateTeam async thunk', () => {
    it('should return updated team', async () => {
      moxios.wait(() => {
        moxios.requests.mostRecent().respondWith({
          status: 200,
          response: { id: 0, teamName: 'Team One', users: mockUsers },
        });
      });

      const oldTeam = { id: 0, teamName: 'Team One', users: mockUsers };
      await updateTeam(oldTeam, 0)(dispatch);

      const expectedStore = {
        teams: {
          teamList: [{ id: 0, teamName: 'Team One', users: mockUsers }],
          getStatus: 'default',
          postStatus: 'default',
          updateStatus: 'ok',
          errorType: 'none',
          duplicateUsers: [],
        },
      };
      expect(store.getState()).toEqual(expectedStore);
    });

    it('should return 409 when duplicate team name', async () => {
      moxios.wait(() => {
        moxios.requests.mostRecent().respondWith({
          status: 409,
          response: duplicateTeamNameResponse.data,
        });
      });

      const oldTeam = { id: 0, teamName: 'Team Noname', users: mockUsers };
      await updateTeam(oldTeam)(dispatch);

      const expectedStore = {
        teams: {
          teamList: [{ id: 0, teamName: 'Team Noname', users: mockUsers }],
          getStatus: 'default',
          postStatus: 'default',
          updateStatus: 'error',
          errorType: 'TeamExists',
          duplicateUsers: [],
        },
      };
      expect(store.getState()).toEqual(expectedStore);
    });

    it('should return 409 when duplicate users selected', async () => {
      moxios.wait(() => {
        moxios.requests.mostRecent().respondWith({
          status: 409,
          response: duplicateUsersPostResponse.data,
        });
      });

      const oldTeam = { id: 0, teamName: 'Team Another Name', users: [] }; // expected duplicates are defined in duplicateUsersPostResponse, not here
      await updateTeam(oldTeam)(dispatch);

      const expectedStore = {
        teams: {
          teamList: [{ id: 0, teamName: 'Team Noname', users: mockUsers }],
          getStatus: 'default',
          postStatus: 'default',
          updateStatus: 'error',
          errorType: 'UserInAnotherTeam',
          duplicateUsers: ['Matt Brook', 'Conel McLane', 'John Smith'],
        },
      };
      expect(store.getState()).toEqual(expectedStore);
    });
  });

  it('should store a Generic error when server rejects request', async () => {
    moxios.wait(() => {
      moxios.requests.mostRecent().reject();
    });

    const newTeam = { teamName: 'Team Another Name', users: [] }; // expected duplicates are defined in duplicateUsersPostResponse, not here
    await postTeam(newTeam)(dispatch);

    const expectedStore = {
      teams: {
        teamList: [{ id: 0, teamName: 'Team Noname', users: mockUsers }],
        getStatus: 'default',
        postStatus: 'error',
        errorType: 'Generic',
        updateStatus: 'default',
        duplicateUsers: [],
      },
    };
    expect(store.getState()).toEqual(expectedStore);
  });
});
