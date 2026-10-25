/*!
 * Copyright (c) 2026 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

module.exports = {
  async fn() {
    const { currentUser } = this.req;
    const cards = await Card.find({
      isInbox: true,
      creatorUserId: currentUser.id,
    }).sort('createdAt desc');

    return {
      items: cards,
    };
  },
};
