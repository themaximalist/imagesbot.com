const GetSearchResults = require("../services/GetSearchResults");

module.exports = async function results(req, res) {
    try {
        const search_results = await GetSearchResults(req.params.query_id);

        search_results.PAGE_TITLE = `${search_results.query.query} Results :: ImagesBot — AI Image Explorer`;
        search_results.PAGE_DESCRIPTION = `${search_results.query.query} AI Image Results`;
        res.render("results", search_results);
    } catch (e) {
        res.status(500).send(e.message);
    }
}