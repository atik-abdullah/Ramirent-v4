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
      label: Sequelize.STRING(300),
      value: Sequelize.STRING(300),
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },
  down: (queryInterface, Sequelize) => {
    //Return a promise that drops a table in case of (migration:undo)
    return queryInterface.dropTable("answers");
  }
};