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
    name: {
      type: 'string',
    },
    isActive: {
      type: 'boolean',
    },
    triggerType: {
      type: 'string',
    },
    triggerConfig: {
      type: 'json',
    },
    conditionsConfig: {
      type: 'json',
    },
    actionsConfig: {
      type: 'json',
    },
  },

  async fn(inputs) {
    const values = _.omitBy(
      _.pick(inputs, [
        'name',
        'isActive',
        'triggerType',
        'triggerConfig',
        'conditionsConfig',
        'actionsConfig',
      ]),
      _.isUndefined,
    );

    const rule = await AutomationRule.qm.updateOne(inputs.id, values);

    if (rule && rule.boardId) {
      sails.sockets.broadcast(
        `board:${rule.boardId}`,
        'automationRuleUpdate',
        { item: rule },
        this.req,
      );
    }

    return { item: rule };
  },
};
