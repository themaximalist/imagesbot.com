const { Query, Search } = require('../models');

module.exports = async function (req, res) {
    try {
        const { query } = req.body;
        if (!query) throw new Error('No query provided');

        const search = await Search.create({
            session_id: req.session,
        });

        if (!search) throw new Error('Error creating search');

        const created = await Query.create({
            SearchId: search.id,
            query,
        });

        res.redirect(`/results/${created.id}`);
    } catch (e) {
        res.status(500).send(`Error searching ${e.message}`);
    }
}