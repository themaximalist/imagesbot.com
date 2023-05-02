const Search = require("../models/search");
const Query = require("../models/query");

module.exports = async function GetSearchByQueryId(query_id) {
    console.log(query_id);
    if (!query_id) throw new Error('No query_id provided');

    const query = await Query.findByPk(query_id, {
        include: [{
            model: Search,
        }]
    });

    console.log(query);

    if (!query) throw new Error('No query found');

    return query.Search;
}