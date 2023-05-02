const log = require("debug")("imagesbot:services:generate");

const { Concept, Search, Result } = require("../models");
const CreateConcept = require("../services/CreateConcept");
const CreateImage = require("../services/CreateImage");
const { randomElement } = require("../utils");
const GetSearchByQueryId = require("./GetSearchByQueryId");

async function getOrCreateConcept(query_id) {

    const search = await GetSearchByQueryId(query_id);

    // STEP 1: Check favorite concepts across all queries
    const favorites = await Concept.findAll({
        where: { SearchId: search.id },
        include: [{ model: Result, required: true, where: { favorite: true } }]
    });

    if (favorites.length > 0) {
        const favoriteConcepts = Array.from(new Set(favorites.map(f => `${f.prompt} ${f.style}`)));
        log(`generating new concept using ${favorites.length} favorite concepts for ${search.id}`);
        return await CreateConcept(query_id, favoriteConcepts);
    }

    // STEP 2: Check specific concepts for this query
    const concepts = await Concept.findAll({ where: { QueryId: query_id } });

    if (concepts.length > 3) {
        log(`using random concept for ${query_id}`);
        return randomElement(concepts);
    }

    // STEP 3: Create a new concept
    log(`creating a new concept for ${query_id}`);
    return await CreateConcept(query_id);
}

async function createResult(query_id) {
    try {
        const concept = await getOrCreateConcept(query_id);
        if (!concept) throw new Error('No concept found');
        return await CreateImage(concept.id);
    } catch (e) {
        console.log(e);
        return null;
    }
}

module.exports = async function* (query_id, options = null) {
    if (!options) options = {};
    if (!options.num) options.num = 10;
    if (options.num > 10) options.num = 10;
    if (options.num < 1) options.num = 1;

    const num_results = await Result.count({
        where: { QueryId: query_id }
    });

    if (num_results >= 5 && !options.explicit) {
        log(`generator already has ${num_results} results for ${query_id}... skipping`);
        return;
    }

    const results = [];
    for (let i = 0; i < options.num; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.random())); // stagger a little bit
        results.push(createResult(query_id));
    }

    while (results.length > 0) {
        const index = await Promise.race(results.map((p, index) => p.then(() => index)));
        const result = await results[index];
        results.splice(index, 1);
        yield result;
    }
}
