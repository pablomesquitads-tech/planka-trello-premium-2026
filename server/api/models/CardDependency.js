/*!
 * Copyright (c) 2026 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

/**
 * CardDependency.js
 *
 * @description :: A model representing dependency links between cards (blocks / blocked_by).
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

const Types = {
  BLOCKS: 'blocks',
  BLOCKED_BY: 'blocked_by',
};

module.exports = {
  Types,

  attributes: {
    type: {
      type: 'string',
      isIn: Object.values(Types),
      defaultsTo: Types.BLOCKS,
    },

    cardId: {
      model: 'Card',
      required: true,
      columnName: 'card_id',
    },
    dependsOnCardId: {
      model: 'Card',
      required: true,
      columnName: 'depends_on_card_id',
    },
  },

  tableName: 'card_dependency',
};
