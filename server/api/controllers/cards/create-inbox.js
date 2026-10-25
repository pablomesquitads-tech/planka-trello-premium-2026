/*!
 * Copyright (c) 2026 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

module.exports = {
  inputs: {
    name: {
      type: 'string',
      required: true,
    },
    description: {
      type: 'string',
    },
    dueDate: {
      type: 'string',
    },
  },

  async fn(inputs) {
    const { currentUser } = this.req;

    const card = await Card.qm.createOne({
      name: inputs.name,
      description: inputs.description,
      dueDate: inputs.dueDate,
      type: Card.Types.PROJECT,
      isInbox: true,
      creatorUserId: currentUser.id,
      listChangedAt: new Date().toISOString(),
    });

    sails.sockets.broadcast(`user:${currentUser.id}`, 'inboxCardCreate', {
      item: card,
    });

    return {
      item: card,
    };
  },
};
