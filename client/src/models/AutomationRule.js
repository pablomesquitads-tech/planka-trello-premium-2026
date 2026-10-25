/*!
 * Copyright (c) 2026 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

import { attr, fk } from 'redux-orm';
import BaseModel from './BaseModel';

export default class extends BaseModel {
  static modelName = 'AutomationRule';

  static fields = {
    id: attr(),
    name: attr(),
    type: attr(),
    isActive: attr(),
    triggerType: attr(),
    triggerConfig: attr(),
    conditionsConfig: attr(),
    actionsConfig: attr(),
    boardId: fk({
      to: 'Board',
      as: 'board',
      relatedName: 'automationRules',
    }),
  };
}
