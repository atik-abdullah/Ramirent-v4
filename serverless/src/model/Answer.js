const Sequelize = require("sequelize");
module.exports = sequelize.define("answer", {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    label: Sequelize.STRING(300),
    value: Sequelize.STRING(300),
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE

});