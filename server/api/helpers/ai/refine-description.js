/*!
 * Copyright (c) 2026 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

module.exports = {
  inputs: {
    title: {
      type: 'string',
      required: true,
    },
    draftText: {
      type: 'string',
      required: true,
    },
  },

  async fn(inputs) {
    const prompt = `Refine and structure the following rough card draft notes into a professional, clear, production-grade description.

Card Title: ${inputs.title}
Rough Notes:
${inputs.draftText}

Structure the output in Markdown with:
### 🎯 Context & Goal
### 📋 Key Requirements / Acceptance Criteria
- [ ] Criteria 1
- [ ] Criteria 2
### 🚀 Implementation Steps
1. Step 1
2. Step 2

Keep it concise and clear.`;

    const refined = await sails.helpers.ai.generateCompletion.with({
      systemPrompt: 'You are a senior technical project lead and business analyst specializing in concise, high-clarity requirements writing.',
      userPrompt: prompt,
      jsonMode: false,
    });

    return refined;
  },
};
