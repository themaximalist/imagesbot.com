const { Query, Search } = require("../models");
const GetFavorites = require("../services/GetFavorites");

module.exports = async function results(req, res) {
    try {
        const favorite_results = await GetFavorites(req.params.search_id);
        res.render("show", favorite_results);
    } catch (e) {
        res.status(500).send(e.message);
    }
}