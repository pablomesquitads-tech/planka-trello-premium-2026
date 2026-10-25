/*!
 * Copyright (c) 2026 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

module.exports = {
  inputs: {
    cardId: {
      type: 'string',
      required: true,
    },
    dependsOnCardId: {
      type: 'string',
      required: true,
    },
  },

  exits: {
    circularDependency: {
      description: 'Dependency cycle detected in card graph.',
    },
  },

  async fn(inputs) {
    const { cardId, dependsOnCardId } = inputs;

    if (String(cardId) === String(dependsOnCardId)) {
      throw 'circularDependency';
    }

    // Traverse upwards from dependsOnCardId to see if cardId can be reached
    const visited = new Set();
    const queue = [dependsOnCardId];

    while (queue.length > 0) {
      const current = queue.shift();
      if (String(current) === String(cardId)) {
        throw 'circularDependency';
      }

      visited.add(current);
      // eslint-disable-next-line no-await-in-loop
      const deps = await CardDependency.find({ cardId: current });
      for (const d of deps) {
        if (!visited.has(d.dependsOnCardId)) {
          queue.push(d.dependsOnCardId);
        }
      }
    }
  },
};
