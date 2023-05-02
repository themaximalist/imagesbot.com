const { Query, Search, Result, Concept } = require("../models");

module.exports = async function GetSearchResults(search_id) {
    if (!search_id) throw new Error('No search_id provided');

    const search = await Search.findByPk(search_id, {
        include: [{ model: Query }]
    });
    if (!search) throw new Error('No search found');

    const favorites = await Result.findAll({
        where: {
            favorite: true,
            SearchId: search.id
        },
        include: [{
            model: Concept,
        }],
        order: [
            ['favorite', 'DESC'],
            ['updatedAt', 'DESC']
        ]
    });

    return { search, favorites };
}