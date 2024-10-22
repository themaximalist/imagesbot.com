const { Concept, Result } = require("../models");
const { saveBufferToImage } = require("../utils");

module.exports = async function CreateImage(concept_id, result_id) {
    const AI = (await import("@themaximalist/ai.js")).default;

    try {
        if (!concept_id) throw new Error('No concept_id provided');
        if (!result_id) throw new Error('No result_id provided'); // we pre-define this so we know where to update

        const concept = await Concept.findByPk(concept_id);
        if (!concept) throw new Error('No concept found');

        const options = {
            service: "replicate",
            model: "black-forest-labs/flux-schnell",
            style_preset: concept.style,
            // seed: 55555,
        };

        const buffer = await AI.Imagine(concept.prompt, options)
        options.model = "black-forest-labs/flux-schnell"; // bug
        const image_url = await saveBufferToImage(buffer);
        const thumbnail_url = await saveBufferToImage(buffer, 200);

        const result_data = {
            id: result_id,
            SearchId: concept.SearchId,
            QueryId: concept.QueryId,
            ConceptId: concept.id,
            service: options.service,
            model: options.model,
            image_url,
            thumbnail_url,
            "options": {
                seed: options.seed
            }
        };

        const result = await Result.create(result_data);
        if (!result) throw new Error('No result created');

        return result.dataValues;
    } catch (e) {
        console.log(e);
        return null;
    }
}