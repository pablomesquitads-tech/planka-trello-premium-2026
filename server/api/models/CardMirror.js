/*!
 * Copyright (c) 2026 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

/**
 * CardMirror.js
 *
 * @description :: A model representing a card mirrored across another board and list.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    position: {
      type: 'number',
      required: true,
    },

    sourceCardId: {
      model: 'Card',
      required: true,
      columnName: 'source_card_id',
    },
    targetBoardId: {
      model: 'Board',
      required: true,
      columnName: 'target_board_id',
    },
    targetListId: {
      model: 'List',
      required: true,
      columnName: 'target_list_id',
    },
  },

  tableName: 'card_mirror',
};
