const Path = require('path');


module.exports = [{
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
      return reply.view('index', {
        'invalid_user': 0,
        'wrong': 0
      });
    }
  }, {
    method: "GET",
    path: "/css/{param*}",
    handler: {
      directory: {
        path: 'public/css'
      }
    }
  }, {
    method: "GET",
    path: "/js/{param*}",
    handler: {
      directory: {
        path: 'public/js'
      }
    }
  }

]
