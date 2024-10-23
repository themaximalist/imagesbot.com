const { Query, Concept, Result } = require("../models");
const { Op } = require("sequelize");
const Sequelize = require("sequelize");

module.exports = async function (limit = 200) {
    return await Result.findAll({
        where: {
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
        limit,
        order: Sequelize.literal('RANDOM()'),
    });
}