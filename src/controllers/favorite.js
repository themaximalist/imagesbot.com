const { Result } = require("../models");
const RealtimeGenerate = require("../services/RealtimeGenerate");

module.exports = async function (req, res) {
    try {
        const { result_id } = req.params;
        const result = await Result.findByPk(result_id);
        if (!result) throw new Error("Result not found");
        const live = JSON.parse(req.body.live);

        res.setHeader("HX-Trigger", "DeleteNode");

        const update = await Result.update({ favorite: true }, { where: { id: result_id } });
        if (!update) throw new Error("Error updating favorite");

        if (live) {
            // GENERATE
            RealtimeGenerate(res, result.QueryId, 3);
        }

        res.render("partials/_favorite", { result });
    } catch (e) {
        res.status(500).send(`Error adding favorite: ${e.message}`);
    }
};