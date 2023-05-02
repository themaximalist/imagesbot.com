const { Search, Result, Concept } = require("../models");

module.exports = async function GetSearchResults(search_id) {
    if (!search_id) throw new Error('No search_id provided');

    const search = await Search.findByPk(search_id);
    if (!search) throw new Error('No search found');

    const all = await Result.findAll({
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

    const favorites = all.filter(result => result.favorite);
    const results = all.filter(result => !result.favorite);

    return { search, favorites, results };
}