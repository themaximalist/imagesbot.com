const log = require("debug")("imagesbot:services:generate");

const { Concept, Search, Result } = require("../models");
const CreateConcept = require("../services/CreateConcept");
const CreateImage = require("../services/CreateImage");
const { randomElement } = require("../utils");

async function getOrCreateConcept(search_id) {
    const favorites = await Concept.findAll({
        where: { SearchId: search_id },
        include: [{ model: Result, required: true, where: { favorite: true } }]
    });

    if (favorites.length > 0) {
        const favoriteConcepts = Array.from(new Set(favorites.map(f => `${f.prompt} ${f.style}`)));
        log(`generating new concept using ${favorites.length} favorite concepts for ${search_id}`);
        return await CreateConcept(search_id, favoriteConcepts);
    }

    const concepts = await Concept.findAll({ where: { SearchId: search_id } });

    if (concepts.length > 3) {
        log(`using random concept for ${search_id}`);
        return randomElement(concepts);
    } else {
        log(`creating a new concept for ${search_id}`);
        return await CreateConcept(search_id);
    }
}

async function createResult(search_id) {
    try {
        const concept = await getOrCreateConcept(search_id);
        if (!concept) throw new Error('No concept found');
        return await CreateImage(concept.id);
    } catch (e) {
        console.log(e);
        return null;
    }
}

module.exports = async function* (search_id, options = null) {
    if (!options) options = {};
    if (!options.num) options.num = 10;
    if (options.num > 10) options.num = 10;
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
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.random())); // stagger a little bit
        results.push(createResult(search_id));
    }

    while (results.length > 0) {
        const index = await Promise.race(results.map((p, index) => p.then(() => index)));
        const result = await results[index];
        results.splice(index, 1);
        yield result;
    }
}
