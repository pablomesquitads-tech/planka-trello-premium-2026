/*!
 * Copyright (c) 2026 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

module.exports = {
  inputs: {
    card: {
      type: 'ref',
      required: true,
    },
    request: {
      type: 'ref',
    },
  },

  async fn(inputs) {
    const { card, request } = inputs;
    const mirrors = await CardMirror.qm.getBySourceCardId(card.id);

    for (const mirror of mirrors) {
      sails.sockets.broadcast(
        `board:${mirror.targetBoardId}`,
        'cardUpdate',
        {
          item: {
            ...card,
            isMirror: true,
            sourceCardId: card.id,
            boardId: mirror.targetBoardId,
            listId: mirror.targetListId,
            position: mirror.position,
          },
        },
        request,
      );
    }
  },
};
