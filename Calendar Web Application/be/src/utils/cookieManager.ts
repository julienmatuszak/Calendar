export const deleteCookie = (name: string, path: string = '/') =>
  (document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; SameSite=Strict;`);

export const addCookie = <T>(
  name: string,
  value: T,
  durationInDays: number,
  path: string = '/',
) => {
  const d = new Date();
  d.setTime(d.getTime() + durationInDays * 24 * 60 * 60 * 1000);
  let expires = `expires=${d.toString()}`;

  const cookieValue = typeof value === 'object' ? JSON.stringify(value) : value;
  document.cookie = `${name}=${cookieValue}; expires=${expires}; path=${path}; SameSite=Strict;`;
};

export const getCookieValue = <T>(name: string): T | null => {
  let cookieName = name + '=';
  let cookies = document.cookie.split(';');

  let cookieValue: string | null = null;
  for (let cookie of cookies) {
    let index = cookie.indexOf(cookieName);
    if (index >= 0) {
      cookieValue = cookie.substring(cookieName.length + index, cookie.length);
    }
  }

  let returnValue = null;
  if (cookieValue != null) {
    try {
      returnValue = JSON.parse(cookieValue);
    } catch (e) {
      returnValue = cookieValue;
    }
    return returnValue;
  } else {
    return null;
  }
};
