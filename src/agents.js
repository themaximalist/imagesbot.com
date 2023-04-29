const AI = require("@themaximalist/ai.js");


async function ConceptAgent(input) {
    const prompt = `
I return JSON with the following structure:

    {
        "seed": 55555, // int 1-4294967295
        "cfg_scale": 7, // int 1-35
        "clip_guidance_preset": "FAST_BLUE", // array ["FAST_BLUE", "FAST_GREEN", "NONE", "SIMPLE", "SLOW", "SLOWER", "SLOWEST"]
        "sampler": "K_EULER", // array ["DDIM", "DDPM", "K_DPMPP_2M", "K_DPMPP_2S_ANCESTRAL", "K_DPM_2", "K_DPM_2_ANCESTRAL", "K_EULER", "K_EULER_ANCESTRAL", "K_HEUN", "K_LMS"]
        "style_preset": "digital-art", // array ["3d-model", "analog-film", "anime", "cinematic", "comic-book", "digital-art", "enhance", "fantasy-art", "isometric", "line-art", "low-poly", "modeling-compound", "neon-punk", "origami", "photographic", "pixel-art", "tile-texture"]
        "text_prompts": [
            {"text": ${JSON.stringify(input)}, "weight": 1},
        ]
    }

Here are the rules I will perform:
- I will randomly change the seed, cfg_scale, clip_guidance_preset, sampler, and style_preset to whatever best matches the users input.
- I will expand the text prompts to include more keywords that match the users input.
- I will not create more than one text prompt, I will only expand the existing one.
- I will only return JSON that JSON.parse() could parse.

Here is the JSON output:
`.trim();


    return await AI(prompt, { parser: JSON.parse });
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