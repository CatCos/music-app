const user = require("../controllers/users.js");

module.exports = [
    {
      method: 'GET',
      path: '/users/favorites',
      handler: user.findFavorites
    },
    {
      method : 'PUT',
      path : '/favorites/add',
      handler : user.addFavorite
    },
    {
      method : 'POST',
      path : '/users/new',
      handler : user.create
    }
];
