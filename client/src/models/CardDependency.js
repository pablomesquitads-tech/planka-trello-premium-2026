/*!
 * Copyright (c) 2026 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

import { attr, fk } from 'redux-orm';
import BaseModel from './BaseModel';

export default class extends BaseModel {
  static modelName = 'CardDependency';

  static fields = {
    id: attr(),
    type: attr(),
    cardId: fk({
      to: 'Card',
      as: 'card',
      relatedName: 'dependencies',
    }),
    dependsOnCardId: fk({
      to: 'Card',
      as: 'dependsOnCard',
      relatedName: 'dependentOnThis',
    }),
  };
}
