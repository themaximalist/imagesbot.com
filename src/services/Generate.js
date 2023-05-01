const log = require("debug")("imagesbot:services:generate");

const { Concept } = require("../models");
const CreateConcept = require("../services/CreateConcept");
const CreateImage = require("../services/CreateImage");
const { randomElement } = require("../utils");

// TODO: if favorites then create a new result based on that
// TODO: new_concept can be set and force a new concept to generate
module.exports = async function* (search_id, num = 2) {
    for (let i = 0; i < num; i++) {
        const concepts = await Concept.findAll({ where: { SearchId: search_id } });

        let concept;
        if (concepts.length > 3) {
            concept = randomElement(concepts);
        } else {
            concept = await CreateConcept(search_id);
            if (!concept) {
                log(`no concept created for ${search_id}`);
                continue;
            }
        }

        log(`generating image for ${concept.prompt}`);

        const result = await CreateImage(concept.id);
        if (!result) {
            log(`no result created for ${concept.prompt}`);
            continue;
        }

        yield result;
    }
}