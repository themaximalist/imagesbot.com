const AI = require("@themaximalist/ai.js");


async function ConceptAgent(positives = [], negatives = []) {

    const concept_prompt = `
I am ConceptGPT, I evolve concepts using likes and dislikes.
I return JSON with the following structure:
===
[
  {
    "text": "A lighthouse on a cliff",
    "weight": 0.5
  }
]
===

I translate INCLUDE and REMOVE into keyword dense creative concepts and weigh them accordingly.
REMOVE keywords should have a negative weight.
Think up any other keywords that should be removed based on the INCLUDE keywords.
Break up the concepts into different text and weight objects.
Don't add too many or you might confuse me.

# INCLUDE
${positives.join("\n")}

# REMOVE
${negatives.join("\n")}

Here is the JSON output:
`.trim();

    return await AI(concept_prompt, { parser: JSON.parse });
}

module.exports = ConceptAgent;