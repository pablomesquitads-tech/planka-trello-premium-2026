/*!
 * Copyright (c) 2026 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

/* Query methods */

const createOne = (values) => CardDependency.create({ ...values }).fetch();

const getByCardId = (cardId) => CardDependency.find({ cardId });

const getByDependsOnCardId = (dependsOnCardId) => CardDependency.find({ dependsOnCardId });

const getByCardIds = (cardIds) => CardDependency.find({ cardId: cardIds });

const getOneById = (id) => CardDependency.findOne(id);

const deleteOne = (criteria) => CardDependency.destroyOne(criteria);

module.exports = {
  createOne,
  getByCardId,
  getByDependsOnCardId,
  getByCardIds,
  getOneById,
  deleteOne,
};
