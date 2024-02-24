const { Query, Concept, Result } = require("../models");
const { Op } = require("sequelize");
module.exports = async function (req, res) {

    let { offset, limit, search } = req.query;
    if (!offset || offset < 0) offset = 0;
    if (!limit || limit < 0 || limit > 500) limit = 100;

    const where = {
        limit,
        offset,
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
    }

    if (search) {
        where.include[0].where = {
            [Op.or]: {
                prompt: { [Op.iLike]: `%${search}%` },
            }
        }
    }

    const { count, rows: results } = await Result.findAndCountAll(where);

    res.render("gallery", {
        count,
        results,
        limit,
        offset,
        search,
    });
}