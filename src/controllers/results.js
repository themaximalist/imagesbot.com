const { Search, Result, Concept } = require("../models");

module.exports = async function results(req, res) {
    try {
        const { search_id } = req.params;
        if (!search_id) throw new Error('No search_id provided');

        const search = await Search.findByPk(search_id);
        if (!search) throw new Error('No search found');

        const concepts = await search.getConcepts();

        const results = await Result.findAll({
            include: [{
                model: Concept,
                required: true,
                include: [{ model: Search, required: true, where: { id: search_id } }],
            }],
            order: [
                ['favorite', 'DESC'],
                ['createdAt', 'DESC']
            ]
        });

        res.render("results", { search, concepts, results });
    } catch (e) {
        res.status(500).send(e.message);
    }
}