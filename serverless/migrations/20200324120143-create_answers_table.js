'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    //You must return a promise
    return queryInterface.createTable("answers", {
      id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },

      formForeignKeyId: Sequelize.INTEGER(11),
      // e.g. "1. Tuenta-alusta ja nostorakenteet ehjät ja turvalliset. Ei tilapäiskorjauksia eikä näkyviö muodonmuutokis"
      label: Sequelize.STRING(300),

      //e.g. "Kyllä"
      value: Sequelize.STRING(300)
    });
  },
  down: (queryInterface, Sequelize) => {
    //Return a promise that drops a table in case of (migration:undo)
    return queryInterface.dropTable("answers");
  }
};