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
    dependsOnCardId: {
      type: 'string',
      required: true,
    },
    type: {
      type: 'string',
      defaultsTo: 'blocks',
    },
  },

  exits: {
    circularDependency: {
      responseType: 'badRequest',
    },
  },

  async fn(inputs) {
    const card = await Card.qm.getOneById(inputs.id);
    const dependsOnCard = await Card.qm.getOneById(inputs.dependsOnCardId);

    if (!card || !dependsOnCard) return this.res.notFound();

    // Check for circular dependency
    await sails.helpers.cardDependencies.validateGraph
      .with({
        cardId: card.id,
        dependsOnCardId: dependsOnCard.id,
      })
      .intercept('circularDependency', () => 'circularDependency');

    const dependency = await CardDependency.qm.createOne({
      cardId: card.id,
      dependsOnCardId: dependsOnCard.id,
      type: inputs.type,
    });

    if (card.boardId) {
      sails.sockets.broadcast(`board:${card.boardId}`, 'cardDependencyCreate', { item: dependency });
    }
    if (dependsOnCard.boardId && dependsOnCard.boardId !== card.boardId) {
      sails.sockets.broadcast(`board:${dependsOnCard.boardId}`, 'cardDependencyCreate', { item: dependency });
    }

    return { item: dependency };
  },
};
