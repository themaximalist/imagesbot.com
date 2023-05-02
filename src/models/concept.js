const { DataTypes, Model } = require("sequelize");

const sequelize = require("../sequelize");
const Query = require("./query");

class Concept extends Model {
}

Concept.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    SearchId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    prompt: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    style: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    sequelize,
});

Concept.belongsTo(Query, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })
Query.hasMany(Concept, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })

module.exports = Concept;