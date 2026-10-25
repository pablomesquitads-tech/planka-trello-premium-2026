/*!
 * Copyright (c) 2026 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

module.exports = {
  inputs: {
    mirrorId: {
      type: 'string',
      required: true,
    },
  },

  async fn(inputs) {
    const mirror = await CardMirror.qm.getOneById(inputs.mirrorId);
    if (!mirror) return this.res.notFound();

    await CardMirror.qm.deleteOne(mirror.id);

    sails.sockets.broadcast(
      `board:${mirror.targetBoardId}`,
      'cardMirrorDelete',
      { item: mirror },
      this.req,
    );

    return { item: mirror };
  },
};
