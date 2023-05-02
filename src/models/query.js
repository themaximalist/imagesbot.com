const { DataTypes, Model } = require("sequelize");

const sequelize = require("../sequelize");
const Search = require("./search");

class Query extends Model {
}

Query.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    query: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    sequelize,
});

Query.belongsTo(Search, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })
Search.hasMany(Query, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })

module.exports = Query;