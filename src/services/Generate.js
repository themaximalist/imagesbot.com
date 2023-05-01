const log = require("debug")("imagesbot:services:generate");

const { Concept, Search, Result } = require("../models");
const CreateConcept = require("../services/CreateConcept");
const CreateImage = require("../services/CreateImage");
const { randomElement } = require("../utils");

async function getOrCreateConcept(search_id) {
    const concepts = await Concept.findAll({ where: { SearchId: search_id } });

    if (concepts.length > 3) {
        return randomElement(concepts);
    } else {
        return await CreateConcept(search_id);
    }
}

async function createImage(concept) {
    return await CreateImage(concept.id);
}

async function createResult(search_id) {
    const concept = await getOrCreateConcept(search_id);
    return await createImage(concept);
}

// TODO: if favorites then create a new result based on that
module.exports = async function* (search_id, options = null) {
    if (!options) options = {};
    if (!options.num) options.num = 5;
    if (options.num > 5) options.num = 5;
    if (options.num < 1) options.num = 1;

    const num_results = await Result.count({
        include: [{
            model: Concept,
            required: true,
            include: [{ model: Search, required: true, where: { id: search_id } }],
        }]
    });

    if (num_results >= 5 && !options.explicit) {
        log(`generator already has ${num_results} results for ${search_id}... skipping`);
        return;
    }

    const results = [];
    for (let i = 0; i < options.num; i++) {
        results.push(createResult(search_id));
    }

    while (results.length > 0) {
        const index = await Promise.race(results.map((p, index) => p.then(() => index)));
        const result = await results[index];
        results.splice(index, 1);
        yield result;
    }
}
