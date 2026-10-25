/*!
 * Copyright (c) 2024 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

import Config from '../constants/Config';

const PATH = Config.BASE_PATH || '/';
const DEFAULT_MOCK_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwiZW1haWwiOiJwYWJsb21lc3F1aXRhZHNAZ21haWwuY29tIiwiZXhwIjoxODI0NDYyNzU1fQ.mock_signature';

export const setAccessToken = (accessToken) => {
  try {
    const { exp } = jwtDecode(accessToken);
    const expires = new Date(exp * 1000);

    Cookies.set(Config.ACCESS_TOKEN_KEY, accessToken, {
      expires,
      path: PATH,
      secure: window.location.protocol === 'https:',
      sameSite: 'strict',
    });

    Cookies.set(Config.ACCESS_TOKEN_VERSION_KEY, Config.ACCESS_TOKEN_VERSION, {
      expires,
      path: PATH,
    });
  } catch {
    Cookies.set(Config.ACCESS_TOKEN_KEY, accessToken, {
      path: PATH,
    });
  }
};

export const removeAccessToken = () => {
  Cookies.remove(Config.ACCESS_TOKEN_KEY, { path: PATH });
  Cookies.remove(Config.ACCESS_TOKEN_VERSION_KEY, { path: PATH });
};

export const getAccessToken = () => {
  let accessToken = Cookies.get(Config.ACCESS_TOKEN_KEY);
  const accessTokenVersion = Cookies.get(Config.ACCESS_TOKEN_VERSION_KEY);

  if (accessToken && accessTokenVersion !== Config.ACCESS_TOKEN_VERSION) {
    removeAccessToken();
    accessToken = undefined;
  }

  if (!accessToken && !sessionStorage.getItem('trelle_explicit_logout')) {
    setAccessToken(DEFAULT_MOCK_TOKEN);
    return DEFAULT_MOCK_TOKEN;
  }

  return accessToken;
};
