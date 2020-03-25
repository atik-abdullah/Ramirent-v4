const Sequelize = require("sequelize");
module.exports = sequelize.define("answer", {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },

    // e.g. "1. Tuenta-alusta ja nostorakenteet ehjät ja turvalliset. Ei tilapäiskorjauksia eikä näkyviö muodonmuutokis"
    label: Sequelize.STRING(300),

    //e.g. "Kyllä"
    value: Sequelize.STRING(300)

}, {
    // See page 2, 7 of sequelizeorm documentation Chapter 4. Model definition
    createdAt: false,
    updatedAt: false
});