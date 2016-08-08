'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      let date = new Date().getTime();

      return queryInterface.bulkInsert('users', [{
        username: 'user1',
        password: 'ola1',
        favorites : JSON.stringify({"mkid":100014423,"name":"Bon Jovi","photo":"https://twitter.com/bonjovi/profile_image?size=original"},
        {"mkid":100000910,"name":"ABBA","photo":"https://graph.facebook.com/124611394231248/picture?width=600"}),
        createdAt: new Date(),
        updatedAt:new Date()
      }], {});
  },

  down: function (queryInterface, Sequelize) {
      return queryInterface.bulkDelete('users', null, {});
  }
};
