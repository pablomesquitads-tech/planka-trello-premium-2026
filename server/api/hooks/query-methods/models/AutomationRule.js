/*!
 * Copyright (c) 2026 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

/* Query methods */

const createOne = (values) => AutomationRule.create({ ...values }).fetch();

const getByBoardId = (boardId) => AutomationRule.find({ boardId }).sort('id');

const getActiveByBoardIdAndTrigger = (boardId, triggerType) =>
  AutomationRule.find({
    or: [{ boardId }, { boardId: null }],
    isActive: true,
    triggerType,
  });

const getOneById = (id) => AutomationRule.findOne(id);

const updateOne = (criteria, values) => AutomationRule.updateOne(criteria).set({ ...values });

const deleteOne = (criteria) => AutomationRule.destroyOne(criteria);

module.exports = {
  createOne,
  getByBoardId,
  getActiveByBoardIdAndTrigger,
  getOneById,
  updateOne,
  deleteOne,
};
