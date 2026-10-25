/*!
 * Copyright (c) 2026 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

module.exports = {
  inputs: {
    card: {
      type: 'ref',
      required: true,
    },
    comments: {
      type: 'ref',
      defaultsTo: [],
    },
  },

  async fn(inputs) {
    const { card, comments } = inputs;

    const commentsText = (comments || [])
      .map((c) => `${c.user?.name || 'User'}: ${c.text}`)
      .join('\n');

    const prompt = `Analyze the following card and conversation history to extract clear, actionable tasks/checklist items.

Card Name: ${card.name}
Description: ${card.description || '(no description)'}

Comments:
${commentsText || '(no comments)'}

Return ONLY a JSON object with this exact structure:
{
  "taskListName": "Action Items",
  "items": [
    "Task title 1",
    "Task title 2"
  ]
}`;

    const completion = await sails.helpers.ai.generateCompletion.with({
      systemPrompt: 'You are an expert product manager that turns unstructured notes and discussion threads into structured checklist items.',
      userPrompt: prompt,
      jsonMode: true,
    });

    try {
      const parsed = JSON.parse(completion);
      return parsed.items || [];
    } catch {
      return ['Review discussion and define tasks'];
    }
  },
};
