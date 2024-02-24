const { Query, Concept, Result } = require("../models");

module.exports = async function (req, res) {
    const { id } = req.params;

    const result = await Result.findByPk(id, {
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

    const related = await Result.findAll({
        where: {
            QueryId: result.QueryId,
        },
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

    res.render("result", { result, related });
}