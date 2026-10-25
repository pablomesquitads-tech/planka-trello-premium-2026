/*!
 * Copyright (c) 2026 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

/**
 * Execute an individual action defined in an automation rule.
 */

const parseRelativeDate = (expression) => {
  const now = new Date();
  const lower = (expression || '').toLowerCase().trim();

  if (lower.startsWith('now +') || lower.startsWith('+')) {
    const match = lower.match(/(\d+)\s*(h|hours?|d|days?|w|weeks?|m|minutes?)/);
    if (match) {
      const amount = parseInt(match[1], 10);
      const unit = match[2];
      if (unit.startsWith('m')) now.setMinutes(now.getMinutes() + amount);
      else if (unit.startsWith('h')) now.setHours(now.getHours() + amount);
      else if (unit.startsWith('d')) now.setDate(now.getDate() + amount);
      else if (unit.startsWith('w')) now.setDate(now.getDate() + amount * 7);
      return now.toISOString();
    }
  }

  if (lower === 'next monday') {
    const daysUntilMonday = ((1 + 7 - now.getDay()) % 7) || 7;
    now.setDate(now.getDate() + daysUntilMonday);
    now.setHours(9, 0, 0, 0);
    return now.toISOString();
  }

  return new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
};

const interpolateTags = (template, context) => {
  if (!template) return '';
  const card = context.card || {};
  const user = context.user || {};
  const list = context.list || {};
  const board = context.board || {};

  return template
    .replace(/\{card\.name\}/g, card.name || '')
    .replace(/\{card\.description\}/g, card.description || '')
    .replace(/\{trigger\.user\}/g, user.name || user.username || 'System')
    .replace(/\{list\.name\}/g, list.name || '')
    .replace(/\{board\.name\}/g, board.name || '');
};

module.exports = {
  inputs: {
    action: {
      type: 'ref',
      required: true,
    },
    card: {
      type: 'ref',
      required: true,
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
    const { action, card, context, depth } = inputs;
    const { type, config = {} } = action;

    switch (type) {
      case 'move_card': {
        if (config.targetListId) {
          const targetList = await List.findOne(config.targetListId);
          if (targetList) {
            await sails.helpers.cards.updateOne.with({
              record: card,
              values: { listId: targetList.id, boardId: targetList.boardId },
              request: context.request,
              automationDepth: depth + 1,
            });
          }
        }
        break;
      }

      case 'set_due_date': {
        const dueDate = config.relativeDate ? parseRelativeDate(config.relativeDate) : config.dueDate;
        await sails.helpers.cards.updateOne.with({
          record: card,
          values: { dueDate, isDueCompleted: false },
          request: context.request,
          automationDepth: depth + 1,
        });
        break;
      }

      case 'add_label': {
        if (config.labelId) {
          const exists = await CardLabel.findOne({ cardId: card.id, labelId: config.labelId });
          if (!exists) {
            await sails.helpers.cardLabels.createOne.with({
              values: { cardId: card.id, labelId: config.labelId },
              card,
              request: context.request,
            });
          }
        }
        break;
      }

      case 'remove_label': {
        if (config.labelId) {
          const cardLabel = await CardLabel.findOne({ cardId: card.id, labelId: config.labelId });
          if (cardLabel) {
            await sails.helpers.cardLabels.deleteOne.with({
              record: cardLabel,
              card,
              request: context.request,
            });
          }
        }
        break;
      }

      case 'add_comment': {
        const text = interpolateTags(config.text, { card, ...context });
        if (text) {
          await sails.helpers.comments.createOne.with({
            values: { text },
            card,
            user: context.user || (await User.findOne({ role: 'admin' })),
            request: context.request,
          });
        }
        break;
      }

      case 'apply_checklist_template': {
        if (Array.isArray(config.tasks) && config.tasks.length > 0) {
          const taskList = await TaskList.qm.createOne({
            cardId: card.id,
            name: config.taskListName || 'Checklist',
            position: 65536,
            showOnFrontOfCard: true,
          });

          let pos = 65536;
          for (const taskName of config.tasks) {
            // eslint-disable-next-line no-await-in-loop
            await Task.qm.createOne({
              taskListId: taskList.id,
              name: interpolateTags(taskName, { card, ...context }),
              position: pos,
              isCompleted: false,
            });
            pos += 65536;
          }

          sails.sockets.broadcast(`board:${card.boardId}`, 'taskListCreate', { item: taskList });
        }
        break;
      }

      case 'external_webhook': {
        if (config.url) {
          try {
            await fetch(config.url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                event: 'automation_action',
                card: { id: card.id, name: card.name, listId: card.listId },
                payload: config.payload || {},
                timestamp: new Date().toISOString(),
              }),
            });
          } catch (err) {
            sails.log.warn('Failed to dispatch automation webhook:', err.message);
          }
        }
        break;
      }

      case 'mirror_card': {
        if (config.targetBoardId && config.targetListId) {
          await CardMirror.qm.createOne({
            sourceCardId: card.id,
            targetBoardId: config.targetBoardId,
            targetListId: config.targetListId,
            position: 65536,
          });
          sails.sockets.broadcast(`board:${config.targetBoardId}`, 'cardMirrorCreate', {
            item: { sourceCardId: card.id, targetBoardId: config.targetBoardId, targetListId: config.targetListId },
          });
        }
        break;
      }

      default:
        sails.log.warn(`Unknown automation action type: ${type}`);
    }
  },
};
