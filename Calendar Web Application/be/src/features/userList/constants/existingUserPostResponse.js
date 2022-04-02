export const existingUserPostResponse = {
  data: {
    errorCode: 409,
    errorMessage: 'UserNameNotUniqueException: user name must be unique',
    timeStamp: '2021-12-05T18:06:12.769+00:00',
    additionalData: {
      errorType: 'UserNameNotUniqueException',
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
    url: '/users',
    data: '{"id":-1,"userName":"Ju Ra","email":"jus@ra.com","password":"admin"}',
  },
  request: {},
};
