/*!
 * Copyright (c) 2026 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

/**
 * server/api/helpers/automations/evaluate-rules.js
 * Rule evaluation engine with infinite loop prevention (depth <= 3).
 */

const evaluateCondition = async (condition, card, context) => {
  const { field, op, value } = condition;

  switch (field) {
    case 'listId': {
      if (op === '==' || op === 'equals') return String(card.listId) === String(value);
      if (op === '!=' || op === 'not_equals') return String(card.listId) !== String(value);
      break;
    }

    case 'label': {
      const cardLabels = await CardLabel.find({ cardId: card.id });
      const labelIds = cardLabels.map((cl) => String(cl.labelId));
      if (op === 'has' || op === 'contains') return labelIds.includes(String(value));
      if (op === 'not_has' || op === 'does_not_contain') return !labelIds.includes(String(value));
      break;
    }

    case 'member': {
      const cardMembers = await CardMembership.find({ cardId: card.id });
      const memberIds = cardMembers.map((cm) => String(cm.userId));
      if (op === 'has' || op === 'contains') return memberIds.includes(String(value));
      if (op === 'not_has') return !memberIds.includes(String(value));
      break;
    }

    case 'dueDateStatus': {
      if (!card.dueDate) return value === 'no_due_date';
      const due = new Date(card.dueDate).getTime();
      const now = Date.now();
      if (value === 'overdue') return due < now && !card.isDueCompleted;
      if (value === 'completed') return !!card.isDueCompleted;
      if (value === 'due_soon') return due >= now && due - now < 24 * 60 * 60 * 1000;
      break;
    }

    case 'customField': {
      const cfVal = await CustomFieldValue.findOne({
        cardId: card.id,
        customFieldId: condition.customFieldId,
      });
      const currentVal = cfVal ? cfVal.content : '';
      if (op === '==' || op === 'equals') return String(currentVal) === String(value);
      if (op === '!=' || op === 'not_equals') return String(currentVal) !== String(value);
      if (op === 'contains') return String(currentVal).toLowerCase().includes(String(value).toLowerCase());
      if (op === '>') return Number(currentVal) > Number(value);
      if (op === '<') return Number(currentVal) < Number(value);
      break;
    }

    default:
      return true;
  }
  return true;
};

module.exports = {
  inputs: {
    event: {
      type: 'string',
      required: true,
    },
    card: {
      type: 'ref',
      required: true,
    },
    boardId: {
      type: 'string',
    },
    context: {
      type: 'ref',
      defaultsTo: {},
    },
    depth: {
      type: 'number',
      defaultsTo: 1,
    },
  },

  async fn(inputs) {
    const { event, card, depth, context } = inputs;
    const boardId = inputs.boardId || card.boardId;

    // 1. Infinite loop check: Max depth 3
    if (depth > 3) {
      sails.log.warn(`[Automation] Max recursion depth (${depth}) reached for card ${card.id}. Halting rule execution.`);
      return;
    }

    // 2. Fetch active rules for this board and trigger
    const rules = await AutomationRule.qm.getActiveByBoardIdAndTrigger(boardId, event);

    for (const rule of rules) {
      const triggerConfig = rule.triggerConfig || {};
      const conditionsConfig = rule.conditionsConfig || [];
      const actionsConfig = rule.actionsConfig || [];

      // Check trigger configuration filter
      if (triggerConfig.listId && String(triggerConfig.listId) !== String(card.listId)) {
        continue;
      }
      if (triggerConfig.labelId && context.labelId && String(triggerConfig.labelId) !== String(context.labelId)) {
        continue;
      }

      // Check conditions
      let matched = true;
      if (Array.isArray(conditionsConfig) && conditionsConfig.length > 0) {
        for (const cond of conditionsConfig) {
          // eslint-disable-next-line no-await-in-loop
          const passes = await evaluateCondition(cond, card, context);
          if (!passes) {
            matched = false;
            break;
          }
        }
      }

      if (!matched) continue;

      sails.log.info(`[Automation] Rule "${rule.name}" triggered by ${event} on card ${card.id}`);

      // Execute actions sequentially
      for (const action of actionsConfig) {
        // eslint-disable-next-line no-await-in-loop
        await sails.helpers.automations.executeAction.with({
          action,
          card,
          context,
          depth,
        });
      }
    }
  },
};
