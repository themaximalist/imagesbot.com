const { Query, Search, Result } = require("../models");

module.exports = async function GetSearchResults(query_id) {

    const query = await Query.findByPk(query_id, {
        include: [{
            model: Search,
        }]
    });

    if (!query) throw new Error('No query found');

    const search = query.Search;

    const all = await Result.findAll({
        where: { SearchId: search.id },
        order: [
            ['favorite', 'DESC'],
            ['updatedAt', 'DESC']
        ]
    });

    const favorites = all.filter(result => result.favorite);
    const results = all.filter(result => !result.favorite);

    return { search, query, favorites, results };
}