const ConceptAgent = require("./ConceptAgent");
const { Search, Concept, Query } = require("../models");
const GetSearchByQueryId = require("./GetSearchByQueryId");

module.exports = async function CreateConcept(query_id, prompt = null) {
    try {
        const query = await Query.findByPk(query_id);
        if (!query) throw new Error('No query found');

        const search = await GetSearchByQueryId(query.id);

        if (!prompt) prompt = query.query;
        const concept = await ConceptAgent(prompt);

        const created = await Concept.create({
            QueryId: query.id,
            SearchId: search.id,
            prompt: concept.prompt,
            style: concept.style
        });

        if (!created) throw new Error('No concept created');

        return created;
    } catch (e) {
        console.log(e);
        return null;
    }
}