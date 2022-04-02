export const duplicateTeamNameResponse = {
  data: {
    errorCode: 409,
    errorMessage: 'TeamExistsException: team with the same name exists on server',
    timeStamp: '2021-12-01T10:47:58.802+00:00',
    additionalData: {
      teamName: 'Team Psychology',
      errorType: 'TeamExistsException',
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
    data: '{"id":-1,"teamName":"Team Psychology","memberIds":[]}',
  },
  request: {},
};
