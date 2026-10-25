/*!
 * Copyright (c) 2026 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

module.exports = {
  inputs: {
    ruleId: {
      type: 'string',
      required: true,
    },
    cardId: {
      type: 'string',
    },
  },

  async fn(inputs) {
    const rule = await AutomationRule.qm.getOneById(inputs.ruleId);
    if (!rule) {
      return this.res.notFound();
    }

    let card = null;
    if (inputs.cardId) {
      card = await Card.qm.getOneById(inputs.cardId);
    }

    if (card && Array.isArray(rule.actionsConfig)) {
      for (const action of rule.actionsConfig) {
        // eslint-disable-next-line no-await-in-loop
        await sails.helpers.automations.executeAction.with({
          action,
          card,
          context: { user: this.req.currentUser, request: this.req },
          depth: 1,
        });
      }
    }

    return { success: true };
  },
};
