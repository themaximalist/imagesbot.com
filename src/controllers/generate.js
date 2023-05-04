const { Result } = require("../models");
const { trigger } = require("../services/Dispatch");
const { render } = require("../utils");
const GetSearchByQueryId = require("../services/GetSearchByQueryId");
const GenerateConcept = require("../services/GenerateConcept");
const uuid = require("uuid").v4;

module.exports = async function (req, res) {
    try {
        const query_id = req.params.query_id;
        const search = await GetSearchByQueryId(query_id);
        const explicit = req.query.explicit === "true";
        const num = 1;
        // req.query.num ? parseInt(req.query.num) : 10;

        const num_results = await Result.count({
            where: { QueryId: query_id }
        });

        if (num_results >= 5 && !explicit) {
            log(`generator already has ${num_results} results for ${query_id}... skipping`);
            return;
        }

        const result_id = uuid();

        const placeholder = await render(res.render.bind(res), "partials/_placeholder", { result_id });
        trigger(search.id, "placeholder", placeholder);

        await new Promise(resolve => setTimeout(resolve, 1000 * Math.random())); // stagger a little bit
        const concept = await GenerateConcept(query_id);
        console.log(concept);

        const html = await render(res.render.bind(res), "partials/_concept", { result_id, concept });
        const concept_message = { result_id, concept: html };
        trigger(search.id, "concept", JSON.stringify(concept_message));

        /*
        const results = [];
        for (let i = 0; i < num; i++) {
            results.push(createResult(query_id));
        }

        while (results.length > 0) {
            const index = await Promise.race(results.map((p, index) => p.then(() => index)));
            const result = await results[index];
            results.splice(index, 1);

            const html = await render(res.render.bind(res), "partials/_result", { result });
            trigger(search.id, html);

            // yield result;
        }
        */
    } catch (e) {
        console.log(e);
        res.status(500).send("Error");
    } finally {
        res.end();
    }
}