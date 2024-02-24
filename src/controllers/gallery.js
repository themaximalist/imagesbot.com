const { Query, Concept, Result } = require("../models");
module.exports = async function (req, res) {
    const results = await Result.findAll({
        include: [
            {
                model: Concept,
                required: true,
                include: [
                    {
                        model: Query,
                        required: true,
                    },
                ],
            },
        ],
    });
    res.render("gallery", { results });
}