import reducer, {
  getTimeOffTypes,
  createNewTimesOffType,
  updateTimeOffType,
} from '../timeOffTypesSlice';

describe('timeOffTypesSlice', () => {
  const initialState = {
    timeOffTypesList: [],
    status: 'default',
  };
  describe('reducers for GET API calls', () => {
    it('should handle initial state', () => {
      const action = {
        type: getTimeOffTypes.fulfilled.type,
        payload: [],
      };
      const state = reducer({ timeOffTypesList: 'undefined', status: 'undefined' }, action);
      expect(state).toEqual({
        timeOffTypesList: [],
        status: 'ok',
      });
    });

    it("sets state 'fetching' when getTimeOffTypesThunk is fetching", () => {
      const action = { type: getTimeOffTypes.pending.type };
      const state = reducer(initialState, action);
      expect(state).toEqual({ timeOffTypesList: [], status: 'fetching' });
    });

    it('populates timeOffTypeList with data when getTimeOffTypesThunk is fulfilled', () => {
      const action = {
        type: getTimeOffTypes.fulfilled.type,
        payload: [{ id: 1, name: 'Education/SLD', color: '1AC889' }],
      };
      const state = reducer(initialState, action);
      expect(state).toEqual({
        timeOffTypesList: [{ id: 1, name: 'Education/SLD', color: '1AC889' }],
        status: 'ok',
      });
    });

    it("sets state 'error' when getTimeOffTypesThunk is rejected", () => {
      const rejectedAction = {
        type: getTimeOffTypes.rejected.type,
      };
      const state = reducer(initialState, rejectedAction);
      expect(state).toEqual({ timeOffTypesList: [], status: 'error' });
    });
  });

  describe('reducers for POST API calls', () => {
    const intialStateAfterGet = {
      timeOffTypesList: [{ id: 1, name: 'Education/SLD', color: '1AC889' }],
      status: 'default',
    };

    it("sets state 'fetching' when createTimeOffTypesThunk is fetching", () => {
      const action = { type: createNewTimesOffType.pending.type };
      const state = reducer(intialStateAfterGet, action);
      expect(state).toEqual({
        timeOffTypesList: [{ id: 1, name: 'Education/SLD', color: '1AC889' }],
        addState: 'fetching',
        status: 'default',
      });
    });

    it('adds timeOffType to timeOffTypeList when createNewTimesOffTypeThunk is fulfilled', () => {
      const action = {
        type: createNewTimesOffType.fulfilled.type,
        payload: { id: 2, name: 'Some Holiday', color: 'FF3797' },
      };
      const state = reducer(intialStateAfterGet, action);
      expect(state).toEqual({
        timeOffTypesList: [
          { id: 1, name: 'Education/SLD', color: '1AC889' },
          { id: 2, name: 'Some Holiday', color: 'FF3797' },
        ],
        addState: 'ok',
        status: 'default',
      });
    });

    it('adds timeOffType to empty timeOffTypeList when createNewTimesOffTypeThunk is fulfilled', () => {
      const action = {
        type: createNewTimesOffType.fulfilled.type,
        payload: { id: 2, name: 'Some Holiday', color: 'FF3797' },
      };
      const state = reducer(initialState, action);
      expect(state).toEqual({
        timeOffTypesList: [{ id: 2, name: 'Some Holiday', color: 'FF3797' }],
        addState: 'ok',
        status: 'default',
      });
    });

    it("sets state 'error' when createTimeOffTypesThunk is rejected", () => {
      const rejectedAction = {
        type: createNewTimesOffType.rejected.type,
      };
      const state = reducer(intialStateAfterGet, rejectedAction);
      expect(state).toEqual({
        timeOffTypesList: [{ id: 1, name: 'Education/SLD', color: '1AC889' }],
        addState: 'eService error',
        status: 'default',
      });
    });
  });

  describe('reducers for PUT API calls', () => {
    const intialStateAfterGet = {
      timeOffTypesList: [
        { id: 1, name: 'Education/SLD', color: '1AC889' },
        { id: 2, name: 'Parental leave', color: 'FFC85F' },
      ],
      status: 'default',
    };

    it("sets state 'fetching' when updateTimeOffTypeThunk is fetching", () => {
      const action = { type: updateTimeOffType.pending.type };
      const state = reducer(intialStateAfterGet, action);
      expect(state).toEqual({
        timeOffTypesList: [
          { id: 1, name: 'Education/SLD', color: '1AC889' },
          { id: 2, name: 'Parental leave', color: 'FFC85F' },
        ],
        editState: 'fetching',
        status: 'default',
      });
    });

    it('updates name of first timeOffType when updateTimeOffTypeThunk is fulfilled', () => {
      const action = {
        type: updateTimeOffType.fulfilled.type,
        payload: { id: 1, name: 'New Education/SLD', color: '1AC889' },
      };
      const state = reducer(intialStateAfterGet, action);
      expect(state).toEqual({
        timeOffTypesList: [
          { id: 1, name: 'New Education/SLD', color: '1AC889' },
          { id: 2, name: 'Parental leave', color: 'FFC85F' },
        ],
        editState: 'ok',
        status: 'default',
      });
    });

    it('updates color of first timeOffType when updateTimeOffTypeThunk is fulfilled', () => {
      const action = {
        type: updateTimeOffType.fulfilled.type,
        payload: { id: 1, name: 'Education/SLD', color: '404CFA' },
      };
      const state = reducer(intialStateAfterGet, action);
      expect(state).toEqual({
        timeOffTypesList: [
          { id: 1, name: 'Education/SLD', color: '404CFA' },
          { id: 2, name: 'Parental leave', color: 'FFC85F' },
        ],
        editState: 'ok',
        status: 'default',
      });
    });

    it('updates color and name of second timeOffType when updateTimeOffTypeThunk is fulfilled', () => {
      const action = {
        type: updateTimeOffType.fulfilled.type,
        payload: { id: 2, name: 'New Parental leave', color: '404CFA' },
      };
      const state = reducer(intialStateAfterGet, action);
      expect(state).toEqual({
        timeOffTypesList: [
          { id: 1, name: 'Education/SLD', color: '1AC889' },
          { id: 2, name: 'New Parental leave', color: '404CFA' },
        ],
        editState: 'ok',
        status: 'default',
      });
    });

    it('does not update timeOffTypes list when nonexisting id passed to updateTimeOffTypeThunk', () => {
      const action = {
        type: updateTimeOffType.fulfilled.type,
        payload: { id: 3, name: 'New Parental leave', color: 'FFC85F' },
      };
      const state = reducer(intialStateAfterGet, action);
      expect(state).toEqual({
        timeOffTypesList: [
          { id: 1, name: 'Education/SLD', color: '1AC889' },
          { id: 2, name: 'Parental leave', color: 'FFC85F' },
        ],
        editState: 'ok',
        status: 'default',
      });
    });

    it("sets state 'error' when updateTimeOffTypeThunk is rejected", () => {
      const rejectedAction = {
        type: updateTimeOffType.rejected.type,
      };
      const state = reducer(intialStateAfterGet, rejectedAction);
      expect(state).toEqual({
        timeOffTypesList: [
          { id: 1, name: 'Education/SLD', color: '1AC889' },
          { id: 2, name: 'Parental leave', color: 'FFC85F' },
        ],
        editState: 'eService error',
        status: 'default',
      });
    });
  });
});
