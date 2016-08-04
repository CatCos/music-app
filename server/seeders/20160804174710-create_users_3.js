'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      let date = new Date().getTime();

      return queryInterface.bulkInsert('users', [{
        username: 'CatCos',
        password: 'ola',
        favorites : JSON.stringify([{id: '100531923', name : 'Lady Gaga' }, {'id' : 100000192, 'name' : 'Queen'}]),
        createdAt: new Date(),
        updatedAt:new Date()
      }], {});
  },

  down: function (queryInterface, Sequelize) {
      return queryInterface.bulkDelete('users', null, {});
  }
};
