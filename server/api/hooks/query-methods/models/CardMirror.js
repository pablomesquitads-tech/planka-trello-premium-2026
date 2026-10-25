/*!
 * Copyright (c) 2026 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

/* Query methods */

const createOne = (values) => CardMirror.create({ ...values }).fetch();

const getBySourceCardId = (sourceCardId) => CardMirror.find({ sourceCardId });

const getByTargetBoardId = (targetBoardId) => CardMirror.find({ targetBoardId });

const getByTargetListId = (targetListId) => CardMirror.find({ targetListId }).sort('position');

const getOneById = (id) => CardMirror.findOne(id);

const deleteOne = (criteria) => CardMirror.destroyOne(criteria);

const deleteBySourceCardId = (sourceCardId) => CardMirror.destroy({ sourceCardId });

module.exports = {
  createOne,
  getBySourceCardId,
  getByTargetBoardId,
  getByTargetListId,
  getOneById,
  deleteOne,
  deleteBySourceCardId,
};
