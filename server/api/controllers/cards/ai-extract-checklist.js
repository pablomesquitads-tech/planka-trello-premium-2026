/*!
 * Copyright (c) 2026 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

module.exports = {
  inputs: {
    id: {
      type: 'string',
      required: true,
    },
  },

  async fn(inputs) {
    const card = await Card.qm.getOneById(inputs.id);
    if (!card) return this.res.notFound();

    const comments = await Comment.find({ cardId: card.id }).sort('createdAt asc');
    const items = await sails.helpers.ai.extractActionItems.with({ card, comments });

    // Create a new task list with the extracted items
    const taskList = await TaskList.qm.createOne({
      cardId: card.id,
      name: 'AI Action Items',
      position: 65536,
      showOnFrontOfCard: true,
    });

    const createdTasks = [];
    let pos = 65536;
    for (const name of items) {
      // eslint-disable-next-line no-await-in-loop
      const task = await Task.qm.createOne({
        taskListId: taskList.id,
        name,
        position: pos,
        isCompleted: false,
      });
      createdTasks.push(task);
      pos += 65536;
    }

    if (card.boardId) {
      sails.sockets.broadcast(`board:${card.boardId}`, 'taskListCreate', { item: taskList });
      for (const t of createdTasks) {
        sails.sockets.broadcast(`board:${card.boardId}`, 'taskCreate', { item: t });
      }
    }

    return {
      taskList,
      tasks: createdTasks,
    };
  },
};
