'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      let date = new Date().getTime();

      return queryInterface.bulkInsert('users', [{
        username: 'user2',
        password: 'ola2',
        favorites : JSON.stringify({"mkid":100531923,
        "name":"Lady Gaga",
        "photo":"https://graph.facebook.com/10376464573/picture?width=600"},
        {"mkid":100000192,"name":"Queen","photo":"https://twitter.com/QueenWillRock/profile_image?size=original"}),
        createdAt: new Date(),
        updatedAt:new Date()
      }], {});
  },

  down: function (queryInterface, Sequelize) {
      return queryInterface.bulkDelete('users', null, {});
  }
};
