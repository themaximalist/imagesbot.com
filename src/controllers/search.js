const Search = require("../models/search");

module.exports = async function (req, res) {
    try {
        const { query } = req.body;
        if (!query) throw new Error('No query provided');

        const search = await Search.create({
            session_id: req.session,
            query
        });

        res.redirect(`/results/${search.id}`);
    } catch (e) {
        res.status(500).send(`Error searching ${e.message}`);
    }
}