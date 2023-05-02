const { Result } = require("../models");

module.exports = async function (req, res) {
    try {
        const { result_id } = req.params;
        const result = await Result.findByPk(result_id);
        if (!result) throw new Error("Result not found");

        res.setHeader("HX-Trigger", "DeleteNode");

        const update = await Result.update({ favorite: false }, { where: { id: result_id } });
        if (!update) throw new Error("Error updating favorite");

        res.render("partials/_result", { result });
    } catch (e) {
        res.status(500).send(`Error adding favorite: ${e.message}`);
    }
};