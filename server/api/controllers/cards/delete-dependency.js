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
    dependencyId: {
      type: 'string',
      required: true,
    },
  },

  async fn(inputs) {
    const dependency = await CardDependency.qm.getOneById(inputs.dependencyId);
    if (!dependency) return this.res.notFound();

    await CardDependency.qm.deleteOne(dependency.id);

    const card = await Card.qm.getOneById(inputs.id);
    if (card && card.boardId) {
      sails.sockets.broadcast(`board:${card.boardId}`, 'cardDependencyDelete', { item: dependency });
    }

    return { item: dependency };
  },
};
