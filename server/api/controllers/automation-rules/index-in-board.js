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
  },

  async fn(inputs) {
    const rules = await AutomationRule.qm.getByBoardId(inputs.boardId);

    return {
      items: rules,
    };
  },
};
