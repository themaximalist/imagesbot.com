const { Search, Result, Concept } = require("../models");

module.exports = async function results(req, res) {
    try {
        const { slug } = req.params;
        if (!slug) throw new Error('No slug provided');

        const search = await Search.findByPk(slug);
        if (!search) throw new Error('No search found');

        const concepts = await search.getConcepts();

        const results = await Result.findAll({
            include: [{
                model: Concept,
                required: true,
                include: [{ model: Search, required: true, where: { id: slug } }],
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