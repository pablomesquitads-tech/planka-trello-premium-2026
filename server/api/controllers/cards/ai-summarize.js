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
  },

  async fn(inputs) {
    const card = await Card.qm.getOneById(inputs.id);
    if (!card) return this.res.notFound();

    const comments = await Comment.find({ cardId: card.id }).sort('createdAt asc');
    const summary = await sails.helpers.ai.summarizeCard.with({ card, comments });

    return {
      summary,
    };
  },
};
