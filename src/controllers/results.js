const GetSearchResults = require("../services/GetSearchResults");

module.exports = async function results(req, res) {
    try {
        const search_results = await GetSearchResults(req.params.search_id);
        res.render("results", search_results);
    } catch (e) {
        res.status(500).send(e.message);
    }
}