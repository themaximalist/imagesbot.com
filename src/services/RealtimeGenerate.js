const log = require("debug")("imagesbot:services:RealtimeGenerate");
const uuid = require("uuid").v4;

const GetSearchByQueryId = require("../services/GetSearchByQueryId");
const GenerateConcept = require("../services/GenerateConcept");
const CreateImage = require("../services/CreateImage");
const { trigger } = require("../services/Dispatch");
const { render } = require("../utils");

async function RealtimeGenerateOne(res, query_id) {
    log("generating one result");

    const search = await GetSearchByQueryId(query_id);

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

async function RealtimeGenerate(res, query_id, num = 1) {
    for (let i = 0; i < num; i++) {
        RealtimeGenerateOne(res, query_id);
    }
}

module.exports = RealtimeGenerate;