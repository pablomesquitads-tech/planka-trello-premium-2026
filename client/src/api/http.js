/*!
 * Copyright (c) 2024 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

import Config from '../constants/Config';

const http = {};

// Static demo builds (e.g. Vercel) have no backend, so every request is answered
// by the in-browser mock instead. Real deployments must leave this unset.
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].forEach((method) => {
  http[method.toLowerCase()] = async (url, data, headers) => {
    if (USE_MOCK) {
      const { handleMockRequest } = await import('./mock-api');

      return handleMockRequest(method, url, data, headers);
    }

    const formData =
      data &&
      Object.keys(data).reduce((result, key) => {
        result.append(key, data[key]);

        return result;
      }, new FormData());

    return fetch(`${Config.BASE_PATH}/api${url}`, {
      method,
      headers,
      body: formData,
      credentials: 'include',
    })
      .then((response) =>
        response.json().then((body) => ({
          body,
          isError: response.status !== 200,
        })),
      )
      .then(({ body, isError }) => {
        if (isError) {
          throw body;
        }

        return body;
      });
  };
});

export { USE_MOCK };

export default http;
