const auth = require('./auth');
const user = require('./users');
const search = require('./search');
var Path = require('path');
const index = [
  {
    method : 'GET',
    path: '/',
    handler: function (request, reply) {
              return reply.view('index', {
                'invalid_user' : 0,
                'wrong' : 0
              });
          }
  },
  {
    method: "GET",
    path: "/css/{param*}",
    handler: {
      directory: { path: 'public/css' }
    }
  }
]
module.exports = [].concat(index, auth, user,  search);