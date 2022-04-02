export const duplicateUsersPostResponse = {
  data: {
    errorCode: 409,
    errorMessage: 'UserInAnotherTeamException: users can only be assigned to one team',
    timeStamp: '2021-12-01T10:53:14.789+00:00',
    additionalData: {
      errorType: 'UserInAnotherTeamException',
      duplicateUsers: ['Matt Brook', 'Conel McLane', 'John Smith'],
    },
  },
  status: 409,
  statusText: '',
  headers: {
    'cache-control': 'no-cache, no-store, max-age=0, must-revalidate',
    'content-type': 'application/json',
    expires: '0',
    pragma: 'no-cache',
  },
  config: {
    transitional: {
      silentJSONParsing: true,
      forcedJSONParsing: true,
      clarifyTimeoutError: false,
    },
    transformRequest: [null],
    transformResponse: [null],
    timeout: 5000,
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
    maxContentLength: -1,
    maxBodyLength: -1,
    headers: {
      LoginFlag: 'e65bes6V4AEGf',
      'Content-Type': 'application/json',
    },
    baseURL: 'http://localhost:8080',
    method: 'post',
    url: '/teams',
    data: '{"id":-1,"teamName":"Team Psychologys","memberIds":[1,2,3]}',
  },
  request: {},
};
