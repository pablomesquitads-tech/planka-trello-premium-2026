/*!
 * Copyright (c) 2026 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

import { attr, fk } from 'redux-orm';
import BaseModel from './BaseModel';

export default class extends BaseModel {
  static modelName = 'CardMirror';

  static fields = {
    id: attr(),
    position: attr(),
    sourceCardId: fk({
      to: 'Card',
      as: 'sourceCard',
      relatedName: 'mirrors',
    }),
    targetBoardId: fk({
      to: 'Board',
      as: 'targetBoard',
      relatedName: 'cardMirrors',
    }),
    targetListId: fk({
      to: 'List',
      as: 'targetList',
      relatedName: 'mirroredCards',
    }),
  };
}
