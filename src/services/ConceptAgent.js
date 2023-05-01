const AI = require("@themaximalist/ai.js");

module.exports = async function ConceptAgent(input) {
    const prompt = `
I am Concept Agent.
I take INPUT from a user and convert it to the following JSON format using the RULES below.
{
    "style": "digital-art" // "3d-model", "analog-film", "anime", "cinematic", "comic-book", "digital-art", "enhance", "fantasy-art", "isometric", "line-art", "low-poly", "modeling-compound", "neon-punk", "origami", "photographic", "pixel-art", "tile-texture"
    "prompt": "keywords, go, here"
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
        const concept = await ai.send();
        if (!concept.style) throw new Error('No style found');
        if (!concept.prompt) throw new Error('No prompt found');

        return {
            style: concept.style,
            prompt: concept.prompt
        };
    } catch (e) {
        console.error(e);
        return null;
    }
}