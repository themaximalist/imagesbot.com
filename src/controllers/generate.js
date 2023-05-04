const log = require("debug")("imagesbot:controllers:generate");
const { Result } = require("../models");
const RealtimeGenerate = require("../services/RealtimeGenerate");

module.exports = async function (req, res) {
    try {
        const explicit = req.query.explicit === "true";
        const query_id = req.params.query_id;
        const num = req.query.num ? parseInt(req.query.num) : 10;

        const num_results = await Result.count({ where: { QueryId: query_id } });
        if (num_results >= 5 && !explicit) {
            log(`generator already has ${num_results} results for ${query_id}... skipping`);
            return;
        }

        RealtimeGenerate(res, query_id, num);
    } catch (e) {
        log(`error generating results for ${req.params.query_id}: ${e.message}`);
        res.status(500).send("Error");
    } finally {
        res.end();
    }
}