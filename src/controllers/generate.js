const Generate = require('../services/Generate');
const { trigger } = require("../services/Dispatch");
const { render } = require("../utils");
const GetSearchByQueryId = require("../services/GetSearchByQueryId");

module.exports = async function (req, res) {
    try {
        const query_id = req.params.query_id;
        const search = await GetSearchByQueryId(query_id);
        const explicit = req.query.explicit === "true";
        const num = req.query.num ? parseInt(req.query.num) : 10;

        const options = {
            explicit,
            num,
        };

        const stream = await Generate(query_id, options);
        for await (const result of stream) {
            const html = await render(res.render.bind(res), "partials/_result", { result });
            trigger(search.id, html);
        }
    } catch (e) {
        console.log(e);
        res.status(500).send("Error");
    } finally {
        res.end();
    }
}