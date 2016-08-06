const user = require("../controllers/users.js");

module.exports = [
    {
      method: 'GET',
      path: '/users/favorites',
      config : {
        auth: 'session',
        handler: user.findFavorites
      }
    },
    {
      method : 'PUT',
      path : '/favorites/add',
      config : {
        auth: 'session',
        handler : user.addFavorite
      }
    },
    {
      method : 'DELETE',
      path : '/favorites/delete',
      config : {
        auth: 'session',
        handler : user.deleteFavorite
      }
    },
    {
      method : 'POST',
      path : '/users/new',
      config : {
        auth: 'session',
        handler : user.create
      }
    }
];
