/*!
 * Copyright (c) 2026 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

/**
 * Natural language to Butler rule schema converter.
 */

module.exports = {
  inputs: {
    prompt: {
      type: 'string',
      required: true,
    },
    boardId: {
      type: 'string',
      required: true,
    },
  },

  async fn(inputs) {
    const lists = await List.find({ boardId: inputs.boardId });
    const labels = await Label.find({ boardId: inputs.boardId });

    const contextInfo = `Available Lists in Board:
${lists.map((l) => `- Name: "${l.name}", ID: "${l.id}"`).join('\n')}

Available Labels in Board:
${labels.map((lb) => `- Name: "${lb.name}", ID: "${lb.id}", Color: "${lb.color}"`).join('\n')}`;

    const systemPrompt = `You are an expert automation architect for Planka/Trello.
Convert the user request into an automation rule configuration.

${contextInfo}

Trigger types:
- card_created, card_moved, checklist_completed, label_added, wip_limit_exceeded, due_date_approaching

Action types:
- move_card (requires targetListId)
- set_due_date (requires relativeDate, e.g. "now + 24 hours", "next monday")
- add_label (requires labelId)
- remove_label (requires labelId)
- add_comment (requires text, supports {card.name}, {trigger.user})
- apply_checklist_template (requires taskListName, tasks: [...])
- external_webhook (requires url)

Return ONLY valid JSON matching this schema:
{
  "name": "Brief descriptive name of the rule",
  "type": "rule",
  "triggerType": "card_moved",
  "triggerConfig": {},
  "conditionsConfig": [],
  "actionsConfig": [
    {
      "type": "set_due_date",
      "config": {
        "relativeDate": "now + 24 hours"
      }
    }
  ]
}`;

    const completion = await sails.helpers.ai.generateCompletion.with({
      systemPrompt,
      userPrompt: inputs.prompt,
      jsonMode: true,
    });

    try {
      return JSON.parse(completion);
    } catch {
      return {
        name: inputs.prompt.slice(0, 40),
        type: 'rule',
        triggerType: 'card_moved',
        triggerConfig: {},
        conditionsConfig: [],
        actionsConfig: [{ type: 'set_due_date', config: { relativeDate: 'now + 24 hours' } }],
      };
    }
  },
};
