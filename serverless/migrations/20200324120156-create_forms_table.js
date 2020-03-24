'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("forms", {
      id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      formId: {
        type: Sequelize.STRING(35),
        allowNull: false,
        unique: true
      },
      title: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      desc: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      created: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      createdBy: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      filledBy: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      filledByName: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      timeStamp: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      fillId: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("forms");
  }
};