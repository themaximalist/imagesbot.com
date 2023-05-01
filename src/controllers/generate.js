const Generate = require('../services/Generate');
const { trigger } = require("../services/Dispatch");

module.exports = async function (req, res) {
    try {
        const search_id = req.params.search_id;
        const result = await Generate(search_id);
        res.render("partials/_result", { result }, (err, html) => {
            if (err) throw err;
            trigger(search_id, html.replace("\n", ""));
        });
    } catch (e) {
        console.log(e);
        res.status(500).send("Error");
    } finally {
        res.end();
    }
}