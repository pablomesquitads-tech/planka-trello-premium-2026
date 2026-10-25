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
    prompt: {
      type: 'string',
      required: true,
    },
  },

  async fn(inputs) {
    const generatedRule = await sails.helpers.automations.aiBuildRule.with({
      prompt: inputs.prompt,
      boardId: inputs.boardId,
    });

    return {
      item: generatedRule,
    };
  },
};
