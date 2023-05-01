const log = require("debug")("imagesbot:services:generate");

const { Concept } = require("../models");
const CreateConcept = require("../services/CreateConcept");
const CreateImage = require("../services/CreateImage");
const { randomElement } = require("../utils");

// TODO: if favorites then create a new result based on that
module.exports = async function (search_id) {

    const concepts = await Concept.findAll({ where: { SearchId: search_id } });

    let concept;
    if (concepts.length > 3) {
        concept = randomElement(concepts);
    } else {
        concept = await CreateConcept(search_id);
        if (!concept) throw new Error('No concept created');
    }

    log(`generating image for ${concept.prompt}`);

    const result = await CreateImage(concept.id);
    if (!result) throw new Error('No result created');

    return result;
}