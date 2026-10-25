/*!
 * Copyright (c) 2026 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

module.exports = {
  inputs: {
    id: {
      type: 'string',
      required: true,
    },
    targetBoardId: {
      type: 'string',
      required: true,
    },
    targetListId: {
      type: 'string',
      required: true,
    },
    position: {
      type: 'number',
      defaultsTo: 65536,
    },
  },

  async fn(inputs) {
    const card = await Card.qm.getOneById(inputs.id);
    if (!card) return this.res.notFound();

    const mirror = await CardMirror.qm.createOne({
      sourceCardId: card.id,
      targetBoardId: inputs.targetBoardId,
      targetListId: inputs.targetListId,
      position: inputs.position,
    });

    sails.sockets.broadcast(
      `board:${inputs.targetBoardId}`,
      'cardMirrorCreate',
      { item: mirror, card },
      this.req,
    );

    return {
      item: mirror,
    };
  },
};
