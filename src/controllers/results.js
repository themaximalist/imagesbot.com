const { Search, Result, Concept } = require("../models");

module.exports = async function results(req, res) {
    try {
        const { search_id } = req.params;
        if (!search_id) throw new Error('No search_id provided');

        const search = await Search.findByPk(search_id);
        if (!search) throw new Error('No search found');

        const allResults = await Result.findAll({
            include: [{
                model: Concept,
                required: true,
                include: [{ model: Search, required: true, where: { id: search_id } }],
            }],
            order: [
                ['favorite', 'DESC'],
                ['updatedAt', 'DESC']
            ]
        });

        const favorites = allResults.filter(result => result.favorite);
        const results = allResults.filter(result => !result.favorite);

        res.render("results", { search, favorites, results });
    } catch (e) {
        res.status(500).send(e.message);
    }
}