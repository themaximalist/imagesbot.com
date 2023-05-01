const { Search, Concept, Result } = require("../models");
const AI = require("@themaximalist/ai.js");
const { bufferToURL } = require("../utils");

module.exports = async function (req, res) {
    try {
        const { concept_id } = req.params;
        if (!concept_id) throw new Error('No concept_id provided');

        const concept = await Concept.findByPk(concept_id, { include: Search });
        if (!concept) throw new Error('No concept found');

        if (concept.Search.session_id !== req.session) throw new Error('session mismatch');

        const options = {
            service: "stability",
            model: "stable-diffusion-xl-beta-v2-2-2",
            style_preset: concept.style,
            seed: 55555,
        };

        const buffer = await AI.Image(concept.prompt, options)
        const image_url = bufferToURL(buffer);

        const result = await Result.create({
            ConceptId: concept.id,
            service: options.service,
            model: options.model,
            image_url,
            options: {
                seed: options.seed
            }
        });
        if (!result) throw new Error('No result created');

        res.render("partials/_result", { result: result.dataValues });
    } catch (e) {
        console.log(e);
        res.status(500).send("Error");
    }
}