const GetSearchResults = require("../services/GetSearchResults");

module.exports = async function results(req, res) {
    try {
        const search_results = await GetSearchResults(req.params.query_id);

        search_results.PAGE_TITLE = `${search_results.query.query} Images — AI Image Explorer`;
        search_results.PAGE_DESCRIPTION = `AI generated images for ${search_results.query.query} with fine-tuning options`;
        res.render("results", search_results);
    } catch (e) {
        res.status(500).send(e.message);
    }
}