const log = require("debug")("app:controllers:generate");
const { Result } = require("../models");
const { trigger } = require("../services/Dispatch");
const { render } = require("../utils");
const GetSearchByQueryId = require("../services/GetSearchByQueryId");
const GenerateConcept = require("../services/GenerateConcept");
const CreateImage = require("../services/CreateImage");
const uuid = require("uuid").v4;

module.exports = async function (req, res) {
    try {
        const query_id = req.params.query_id;
        const search = await GetSearchByQueryId(query_id);
        const explicit = req.query.explicit === "true";
        const num = req.query.num ? parseInt(req.query.num) : 10;

        const num_results = await Result.count({
            where: { QueryId: query_id }
        });

        if (num_results >= 5 && !explicit) {
            log(`generator already has ${num_results} results for ${query_id}... skipping`);
            return;
        }

        async function generateOne() {
            const result_id = uuid();
            let message = {
                result_id,
                html: ""
            };
            const placeholder = await render(res.render.bind(res), "partials/_placeholder", { result_id });
            trigger(search.id, "placeholder", placeholder);

            const concept = await GenerateConcept(query_id);

            message.html = await render(res.render.bind(res), "partials/_concept", { result_id, concept });
            trigger(search.id, "concept", JSON.stringify(message));


            const result = await CreateImage(concept.id, result_id);
            message.html = await render(res.render.bind(res), "partials/_result", { result });
            trigger(search.id, "result", JSON.stringify(message));
        }

        for (let i = 0; i < num; i++) {
            generateOne();
        }
    } catch (e) {
        log(`error generating results for ${req.params.query_id}: ${e.message}`);
        res.status(500).send("Error");
    } finally {
        res.end();
    }
}