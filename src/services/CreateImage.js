const AI = require("@themaximalist/ai.js");

const { Concept, Result } = require("../models");
const { bufferToURL } = require("../utils");

module.exports = async function CreateImage(concept_id) {
    try {
        if (!concept_id) throw new Error('No concept_id provided');

        const concept = await Concept.findByPk(concept_id);
        if (!concept) throw new Error('No concept found');

        const options = {
            service: "stability",
            model: "stable-diffusion-xl-beta-v2-2-2",
            style_preset: concept.style,
            seed: 55555,
        };

        const buffer = await AI.Image(concept.prompt, options)
        const image_url = bufferToURL(buffer);

        const result = await Result.create({
            SearchId: concept.SearchId,
            QueryId: concept.QueryId,
            ConceptId: concept.id,
            service: options.service,
            model: options.model,
            image_url,
            options: {
                seed: options.seed
            }
        });
        if (!result) throw new Error('No result created');

        return result;
    } catch (e) {
        console.log(e);
        return null;
    }
}