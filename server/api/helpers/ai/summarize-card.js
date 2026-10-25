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

    const prompt = `Generate a concise Executive Summary for the following card:

Card: ${card.name}
Description: ${card.description || '(no description)'}

Comments history:
${commentsText || '(no comments)'}

Provide:
1. Core Decision / State Summary (2-3 sentences)
2. Blockers or Pending Questions (bullet points)
3. Next Immediate Steps (bullet points)

Format using GitHub-flavored Markdown.`;

    const summary = await sails.helpers.ai.generateCompletion.with({
      systemPrompt: 'You are an executive assistant who synthesizes meeting notes and comment threads into clear, actionable summaries.',
      userPrompt: prompt,
      jsonMode: false,
    });

    return summary;
  },
};
