'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {

    queryInterface.addColumn(
      'artists',
      'type', {
        type: Sequelize.STRING,
        allowNull: true
      }
    )

    queryInterface.addColumn(
      'artists',
      'country', {
        type: Sequelize.STRING,
        allowNull: true
      }
    )

    queryInterface.addColumn(
      'artists',
      'start_date', {
        type: Sequelize.DATEONLY,
        allowNull: true
      }
    )
    queryInterface.addColumn(
      'artists',
      'current_members', {
        type: Sequelize.ARRAY(Sequelize.JSON),
        allowNull: true
      }
    )
  },

  down: function(queryInterface, Sequelize) {
    queryInterface.removeColumn(
      'artists',
      'type'
    )

    queryInterface.removeColumn(
      'artists',
      'country'
    )

    queryInterface.removeColumn(
      'artists',
      'start_date'
    )
    queryInterface.removeColumn(
      'artists',
      'current_members'
    )
  }
};
