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
    const rule = await AutomationRule.qm.deleteOne(inputs.id);

    if (rule && rule.boardId) {
      sails.sockets.broadcast(
        `board:${rule.boardId}`,
        'automationRuleDelete',
        { item: rule },
        this.req,
      );
    }

    return { item: rule };
  },
};
