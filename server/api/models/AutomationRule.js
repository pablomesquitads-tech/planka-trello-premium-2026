/*!
 * Copyright (c) 2026 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

/**
 * AutomationRule.js
 *
 * @description :: A model representing a Butler automation rule or action button.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

const Types = {
  RULE: 'rule',
  CARD_BUTTON: 'card_button',
  BOARD_BUTTON: 'board_button',
  SCHEDULED: 'scheduled',
};

const TriggerTypes = {
  CARD_CREATED: 'card_created',
  CARD_MOVED: 'card_moved',
  CARD_ARCHIVED: 'card_archived',
  TASK_COMPLETED: 'task_completed',
  CHECKLIST_COMPLETED: 'checklist_completed',
  LABEL_ADDED: 'label_added',
  LABEL_REMOVED: 'label_removed',
  MEMBER_ADDED: 'member_added',
  MEMBER_REMOVED: 'member_removed',
  CUSTOM_FIELD_CHANGED: 'custom_field_changed',
  WIP_LIMIT_EXCEEDED: 'wip_limit_exceeded',
  DUE_DATE_APPROACHING: 'due_date_approaching',
  CRON: 'cron',
  BUTTON_CLICKED: 'button_clicked',
};

module.exports = {
  Types,
  TriggerTypes,

  attributes: {
    name: {
      type: 'string',
      required: true,
    },
    type: {
      type: 'string',
      isIn: Object.values(Types),
      defaultsTo: Types.RULE,
    },
    isActive: {
      type: 'boolean',
      defaultsTo: true,
      columnName: 'is_active',
    },
    triggerType: {
      type: 'string',
      isIn: Object.values(TriggerTypes),
      required: true,
      columnName: 'trigger_type',
    },
    triggerConfig: {
      type: 'json',
      columnName: 'trigger_config',
    },
    conditionsConfig: {
      type: 'json',
      columnName: 'conditions_config',
    },
    actionsConfig: {
      type: 'json',
      columnName: 'actions_config',
    },

    boardId: {
      model: 'Board',
      columnName: 'board_id',
    },
  },

  tableName: 'automation_rule',
};
