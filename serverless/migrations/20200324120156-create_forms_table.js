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

      // e.g. FI1020
      formId: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },

      // e.g. Henkilönostimen palaustustarkastus
      title: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },

      // e.g. Kaikki toimipisteet
      desc: {
        type: Sequelize.STRING(50),
        allowNull: true
      },

      // e.g. 1552911721294
      created: {
        type: Sequelize.STRING(50),
        allowNull: true
      },

      // e.g. jarno.piiroinen@ramirent.fi
      createdBy: {
        type: Sequelize.STRING(50),
        allowNull: true
      },

      // e.g. 000015
      productId: {
        type: Sequelize.STRING(50),
        allowNull: true
      },

      // e.g. elisa.tani@ramirent.fi
      filledBy: {
        type: Sequelize.STRING(50),
        allowNull: true
      },

      // e.g. Elisa Tani
      filledByName: {
        type: Sequelize.STRING(50),
        allowNull: true
      },

      // e.g. 1567743874719
      timeStamp: {
        type: Sequelize.STRING(50),
        allowNull: true
      },

      // 000015-FI1020-2019-09-06-07_24_34:724
      fillId: {
        type: Sequelize.STRING(50),
        allowNull: true

      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("forms");
  }
};