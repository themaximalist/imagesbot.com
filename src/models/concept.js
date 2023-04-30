const { DataTypes, Model } = require("sequelize");

const sequelize = require("../sequelize");
const Search = require("./search");

class Concept extends Model {
}

Concept.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
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

Concept.belongsTo(Search, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })
Search.hasMany(Concept, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })

module.exports = Concept;