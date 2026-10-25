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
    draftText: {
      type: 'string',
      required: true,
    },
  },

  async fn(inputs) {
    const card = await Card.qm.getOneById(inputs.id);
    if (!card) return this.res.notFound();

    const refined = await sails.helpers.ai.refineDescription.with({
      title: card.name,
      draftText: inputs.draftText,
    });

    return {
      description: refined,
    };
  },
};
