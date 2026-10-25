/*!
 * Copyright (c) 2024 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

import Config from '../constants/Config';
import { handleMockRequest } from './mock-api';

const http = {};

['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].forEach((method) => {
  http[method.toLowerCase()] = async (url, data, headers) => {
    try {
      let bodyData = data;
      let reqHeaders = headers;

      if (data && !(data instanceof FormData) && typeof data === 'object') {
        bodyData = Object.keys(data).reduce((result, key) => {
          if (data[key] !== undefined && data[key] !== null) {
            result.append(key, data[key]);
          }
          return result;
        }, new FormData());
      }

      const response = await fetch(`${Config.BASE_PATH}/api${url}`, {
        method,
        headers: reqHeaders,
        body: method === 'GET' ? undefined : bodyData,
        credentials: 'include',
      });

      const contentType = response.headers.get('content-type') || '';
      const text = await response.text();

      // If response is HTML (due to static SPA rewrite on Vercel) or not found, use mock API
      if (
        contentType.includes('text/html') ||
        text.trim().startsWith('<!doctype') ||
        text.trim().startsWith('<html') ||
        response.status === 404
      ) {
        return await handleMockRequest(method, url, data, headers);
      }

      let body;
      try {
        body = JSON.parse(text);
      } catch {
        return await handleMockRequest(method, url, data, headers);
      }

      if (response.status !== 200) {
        throw body;
      }

      return body;
    } catch (error) {
      if (error && (error.code === 'E_UNAUTHORIZED' || error.message?.includes('Apenas pablomesquitads@gmail.com'))) {
        throw error;
      }
      return await handleMockRequest(method, url, data, headers);
    }
  };
});

export default http;
