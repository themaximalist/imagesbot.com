const log = require("debug")("imagesbot:services:generate");

const { Query, Concept, Result } = require("../models");
const CreateConcept = require("../services/CreateConcept");
const { randomElement } = require("../utils");
const GetSearchByQueryId = require("./GetSearchByQueryId");

module.exports = async function GenerateConcept(query_id) {

    const query = await Query.findByPk(query_id);
    if (!query) throw new Error(`query ${query_id} not found`);

    // STEP 1: Check specific concepts for this query
    const concepts = await Concept.findAll({ where: { QueryId: query_id } });
    if (concepts.length == 0) { // either new search or a new query..let's generate new concepts
        log(`creating a new concept for new query ${query_id}`);
        return await CreateConcept(query_id);
    }

    const search = await GetSearchByQueryId(query_id);
    if (!search) throw new Error(`search ${query_id} not found`);

    // STEP 2: Check favorite concepts across all queries
    const favorites = await Concept.findAll({
        where: { SearchId: search.id },
        include: [{ model: Result, required: true, where: { favorite: true } }]
    });

    if (favorites.length > 0) {
        const favoriteConcepts = Array.from(new Set(favorites.map(f => `${f.prompt} ${f.style}`)));
        log(`generating new concept using ${favorites.length} favorite concepts for ${search.id}`);
        return await CreateConcept(query_id, favoriteConcepts);
    }


    // STEP 3: If we have more than 3 concepts, use a random one
    if (concepts.length > 3) {
        log(`using random concept for ${query_id}`);
        return randomElement(concepts);
    }

    // STEP 4: Create a new concept
    log(`creating a new concept for ${query_id}`);
    return await CreateConcept(query_id);
}
