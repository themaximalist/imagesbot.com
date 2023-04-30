const AI = require("@themaximalist/ai.js");

function parser(input) {
    console.log(input);
    return JSON.parse(input);
}

async function ConceptAgent(input) {
    const prompt = `
I am Concept Agent.
I take INPUT from a user and convert it to the following JSON format using the RULES below.
{
    "style_preset": "digital-art" // "3d-model", "analog-film", "anime", "cinematic", "comic-book", "digital-art", "enhance", "fantasy-art", "isometric", "line-art", "low-poly", "modeling-compound", "neon-punk", "origami", "photographic", "pixel-art", "tile-texture"
    "text_prompts": [
        {"text": "user input", "weight": 1}
    ]
}

# RULES
- I expand the text prompt into complex and artistic concepts
- The artistic concepts should be verbose and dense keywords, separated by commas (CSV)
- The keywords should include artist names, styles, eras, lighting, composition, colors, and other artistic concepts—go wild!
- I will only generate one text_prompt concept
- I will select an appropriate style from the list above based on the keywords
- I will only use the style_preset list above
- I will only output JSON that JSON.parse() could handle

The user will now enter their input and I will output the JSON.
`.trim();


    const ai = new AI(null, { parser: AI.parseJSONFromText });
    ai.system(prompt);
    ai.user(`${input}\nPlease output the JSON now`);
    try {
        return await ai.send();
    } catch (e) {
        console.error(e);
        return null;
    }

}

/*
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
*/

module.exports = ConceptAgent;