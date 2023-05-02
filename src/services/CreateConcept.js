const ConceptAgent = require("./ConceptAgent");
const { Search, Concept } = require("../models");

module.exports = async function CreateConcept(search_id, query = null) {
    try {
        if (!search_id) throw new Error('No search_id provided');

        const search = await Search.findByPk(search_id);
        if (!search) throw new Error('No search found');

        if (!query) query = search.query;
        const concept = await ConceptAgent(query);

        const created = await Concept.create({
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