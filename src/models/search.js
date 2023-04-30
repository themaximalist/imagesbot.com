const { DataTypes, Model } = require("sequelize");

const sequelize = require("../sequelize");

class Search extends Model {
}

Search.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    session_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: false
    },
    query: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    sequelize,
});

module.exports = Search;