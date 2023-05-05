const { Query, Concept, Result } = require("../models");
const { Op } = require("sequelize");
const Sequelize = require("sequelize");

module.exports = async function (limit = 100) {
    return await Result.findAll({
        where: {
            id: {
                [Op.in]: Sequelize.literal(`(
                    SELECT r.id
                    FROM "Results" AS r
                    INNER JOIN (
                        SELECT "QueryId", MAX("createdAt") as max_created_at
                        FROM "Results"
                        GROUP BY "QueryId"
                    ) AS sq ON r."QueryId" = sq."QueryId" AND r."createdAt" = sq.max_created_at
                )`),
            },
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
        order: [["createdAt", "DESC"]],
    });
}