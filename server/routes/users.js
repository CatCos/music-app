const user = require("../controllers/users.js");

module.exports = [
    {
      method: 'GET',
      path: '/users/favorites',
      handler: user.findFavorites
    {
      method : 'POST',
      path : '/users/new',
      handler : user.create
    }
];
