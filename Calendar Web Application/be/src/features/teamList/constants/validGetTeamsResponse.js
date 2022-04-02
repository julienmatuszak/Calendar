export const getTeamsResponse = {
  data: [
    {
      id: 1,
      teamName: 'Team Lorem Ipsum',
      users: [
        {
          id: 1,
          userName: 'Matt Brook',
          email: 'mattbrook@gmail.com',
        },
        {
          id: 2,
          userName: 'Conel McLane',
          email: 'conelmclane@gmail.com',
        },
        {
          id: 3,
          userName: 'John Smith',
          email: 'johnsmith@gmail.com',
        },
      ],
    },
    {
      id: 2,
      teamName: 'Team Psychology',
      users: [
        {
          id: 4,
          userName: 'Phineas Gage',
          email: 'phineas@gage.com',
        },
        {
          id: 5,
          userName: 'Little Albert',
          email: 'little@albert.com',
        },
        {
          id: 6,
          userName: 'Ivan Pavlov',
          email: 'ivan@pavlov.com',
        },
      ],
    },
  ],
  status: 200,
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
    },
    baseURL: 'http://localhost:8080',
    method: 'get',
    url: '/teams',
  },
  request: {},
};
