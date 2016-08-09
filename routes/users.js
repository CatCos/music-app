const user = require("../controllers/users.js");

module.exports = [{
  method: 'GET',
  path: '/users/favorites',
  config: {
    auth: {
      strategy: 'session'
    },
    handler: user.findFavorites,
    plugins: {
      'hapi-auth-cookie': {
        redirectTo: '/'
      }
    }
  }
}, {
  method: 'PUT',
  path: '/favorites/add',
  config: {
    auth: {
      strategy: 'session'
    },
    handler: user.addFavorite,
    plugins: {
      'hapi-auth-cookie': {
        redirectTo: '/'
      }
    }
  }

}, {
  method: 'DELETE',
  path: '/favorites/delete',
  config: {
    auth: 'session',
    handler: user.deleteFavorite
  }
}, {
  method: 'POST',
  path: '/users/new',
  handler: user.create
}];
