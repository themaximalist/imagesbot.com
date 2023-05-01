const Generate = require('../services/Generate');

module.exports = async function (req, res) {
    try {
        const result = await Generate(req.params.search_id);
        res.render("partials/_result", { result });
    } catch (e) {
        console.log(e);
        res.status(500).send("Error");
    }
}