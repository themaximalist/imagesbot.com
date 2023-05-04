const { Query, Search } = require('../models');

module.exports = async function (req, res) {
    try {
        const { query } = req.body;
        if (!query) throw new Error('No query provided');

        let search;
        const search_id = req.body.search_id;
        if (search_id) {
            search = await Search.findByPk(search_id);
        } else {
            search = await Search.create({
                session_id: req.session,
            });
        }

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