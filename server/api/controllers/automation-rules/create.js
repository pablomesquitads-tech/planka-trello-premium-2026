/*!
 * Copyright (c) 2026 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

module.exports = {
  inputs: {
    boardId: {
      type: 'string',
      required: true,
    },
    name: {
      type: 'string',
      required: true,
    },
    type: {
      type: 'string',
      defaultsTo: 'rule',
    },
    isActive: {
      type: 'boolean',
      defaultsTo: true,
    },
    triggerType: {
      type: 'string',
      required: true,
    },
    triggerConfig: {
      type: 'json',
      defaultsTo: {},
    },
    conditionsConfig: {
      type: 'json',
      defaultsTo: [],
    },
    actionsConfig: {
      type: 'json',
      defaultsTo: [],
    },
  },

  async fn(inputs) {
    const values = _.pick(inputs, [
      'name',
      'type',
      'isActive',
      'triggerType',
      'triggerConfig',
      'conditionsConfig',
      'actionsConfig',
    ]);

    const rule = await AutomationRule.qm.createOne({
      ...values,
      boardId: inputs.boardId,
    });

    sails.sockets.broadcast(
      `board:${inputs.boardId}`,
      'automationRuleCreate',
      { item: rule },
      this.req,
    );

    return { item: rule };
  },
};
