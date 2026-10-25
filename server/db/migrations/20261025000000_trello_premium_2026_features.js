/*!
 * Copyright (c) 2026 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

/**
 * Trello Premium 2026 Migration
 * - Super-Lists: List wip_limit, is_collapsed
 * - Global Inbox & Planner: Card is_inbox, scheduled_start_time, scheduled_end_time, nullable board_id/list_id
 * - Advanced Checklists: Task due_date
 * - Typed Custom Fields: CustomField type, options
 * - Hybrid Automation Engine: automation_rule table
 * - Card Mirroring: card_mirror table
 * - Card Dependencies: card_dependency table
 */

module.exports.up = async (knex) => {
  // 1. Super-Lists
  await knex.schema.alterTable('list', (table) => {
    table.integer('wip_limit');
    table.boolean('is_collapsed').notNullable().defaultTo(false);
  });

  // 2. Global Inbox & Planner
  await knex.schema.alterTable('card', (table) => {
    table.boolean('is_inbox').notNullable().defaultTo(false);
    table.timestamp('scheduled_start_time', true);
    table.timestamp('scheduled_end_time', true);

    // Make board_id and list_id nullable for pure global inbox items
    table.bigInteger('board_id').nullable().alter();
    table.bigInteger('list_id').nullable().alter();

    table.index('is_inbox');
    table.index('scheduled_start_time');
  });

  // 3. Advanced Checklists (Task due date)
  await knex.schema.alterTable('task', (table) => {
    table.timestamp('due_date', true);
    table.index('due_date');
  });

  // 4. Custom Fields (Types: text, number, date, checkbox, dropdown + options)
  await knex.schema.alterTable('custom_field', (table) => {
    table.text('type').notNullable().defaultTo('text');
    table.jsonb('options');
  });

  // 5. Automation Rules (Butler + Natural Language AI)
  await knex.schema.createTable('automation_rule', (table) => {
    table.bigInteger('id').primary().defaultTo(knex.raw('next_id()'));
    table.bigInteger('board_id');
    table.text('name').notNullable();
    table.text('type').notNullable().defaultTo('rule'); // rule, card_button, board_button, scheduled
    table.boolean('is_active').notNullable().defaultTo(true);
    table.text('trigger_type').notNullable();
    table.jsonb('trigger_config').notNullable().defaultTo('{}');
    table.jsonb('conditions_config').notNullable().defaultTo('[]');
    table.jsonb('actions_config').notNullable().defaultTo('[]');

    table.timestamp('created_at', true);
    table.timestamp('updated_at', true);

    table.index('board_id');
    table.index('type');
    table.index('trigger_type');
    table.index('is_active');
  });

  // 6. Card Mirrors (Card Mirroring across boards and lists)
  await knex.schema.createTable('card_mirror', (table) => {
    table.bigInteger('id').primary().defaultTo(knex.raw('next_id()'));
    table.bigInteger('source_card_id').notNullable();
    table.bigInteger('target_board_id').notNullable();
    table.bigInteger('target_list_id').notNullable();
    table.specificType('position', 'double precision').notNullable();

    table.timestamp('created_at', true);
    table.timestamp('updated_at', true);

    table.index('source_card_id');
    table.index('target_board_id');
    table.index('target_list_id');
  });

  // 7. Card Dependencies (Blocks / Blocked_By graph)
  await knex.schema.createTable('card_dependency', (table) => {
    table.bigInteger('id').primary().defaultTo(knex.raw('next_id()'));
    table.bigInteger('card_id').notNullable();
    table.bigInteger('depends_on_card_id').notNullable();
    table.text('type').notNullable().defaultTo('blocks'); // blocks, blocked_by

    table.timestamp('created_at', true);
    table.timestamp('updated_at', true);

    table.unique(['card_id', 'depends_on_card_id']);
    table.index('card_id');
    table.index('depends_on_card_id');
  });
};

module.exports.down = async (knex) => {
  await knex.schema.dropTableIfExists('card_dependency');
  await knex.schema.dropTableIfExists('card_mirror');
  await knex.schema.dropTableIfExists('automation_rule');

  await knex.schema.alterTable('custom_field', (table) => {
    table.dropColumn('options');
    table.dropColumn('type');
  });

  await knex.schema.alterTable('task', (table) => {
    table.dropIndex('due_date');
    table.dropColumn('due_date');
  });

  await knex.schema.alterTable('card', (table) => {
    table.dropIndex('scheduled_start_time');
    table.dropIndex('is_inbox');
    table.dropColumn('scheduled_end_time');
    table.dropColumn('scheduled_start_time');
    table.dropColumn('is_inbox');
    table.bigInteger('board_id').notNullable().alter();
    table.bigInteger('list_id').notNullable().alter();
  });

  await knex.schema.alterTable('list', (table) => {
    table.dropColumn('is_collapsed');
    table.dropColumn('wip_limit');
  });
};
