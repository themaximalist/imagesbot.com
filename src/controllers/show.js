const GetFavorites = require("../services/GetFavorites");

module.exports = async function results(req, res) {
    try {
        const favorite_results = await GetFavorites(req.params.search_id);
        favorite_results.PAGE_TITLE = `${favorite_results.search.Queries[0].query} :: AI Image Explorer — AI Image Explorer`;
        favorite_results.PAGE_DESCRIPTION = `${favorite_results.search.Queries[0].query} images`;
        res.render("show", favorite_results);
    } catch (e) {
        res.status(500).send(e.message);
    }
}