/*!
 * Copyright (c) 2024 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

import socketIOClient from 'socket.io-client';
import sailsIOClient from 'sails.io.js';

import Config from '../constants/Config';
import http from './http';

const io = sailsIOClient(socketIOClient);

io.sails.path = `${Config.BASE_PATH}/socket.io`;
io.sails.autoConnect = false;
io.sails.reconnection = true;
io.sails.useCORSRouteToGetCookie = false;
io.sails.environment = import.meta.env.MODE;

const { socket } = io;

socket.connect = socket._connect; // eslint-disable-line no-underscore-dangle

['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].forEach((method) => {
  socket[method.toLowerCase()] = (url, data, headers) => {
    // If socket is not connected or in standalone/static mode, fallback directly to HTTP
    if (!socket.isConnected || !socket.isConnected()) {
      return http[method.toLowerCase()](url, data, headers);
    }

    return new Promise((resolve, reject) => {
      let isSettled = false;
      const timer = setTimeout(() => {
        if (!isSettled) {
          isSettled = true;
          http[method.toLowerCase()](url, data, headers).then(resolve).catch(reject);
        }
      }, 2000);

      socket.request(
        {
          method,
          data,
          headers,
          url: `/api${url}`,
        },
        (body, { error }) => {
          if (isSettled) return;
          isSettled = true;
          clearTimeout(timer);

          if (body instanceof Error || error) {
            http[method.toLowerCase()](url, data, headers).then(resolve).catch(reject);
          } else {
            resolve(body);
          }
        },
      );
    });
  };
});

export default socket;
