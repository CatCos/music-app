const Hapi = require('hapi');
const Joi = require('joi');
const routes = require('./routes');
const models = require('./models');
const Sequelize = require('sequelize')
const Jade = require('jade');
const Path = require('path')
  // Create a server with a host and port
const server = new Hapi.Server();

server.connection({
  host: process.env.HOST,
  port: process.env.PORT
});

server.register([require('hapi-auth-cookie'),
  require('inert'),
  require('vision')
], (err) => {

  server.auth.strategy('session', 'cookie', {
    password: process.env.COOKIE_PASS,
    cookie: 'sid-example',
    redirectTo: '/',
    isSecure: false
  });


  server.views({
    engines: {
      jade: Jade
    },
    path: Path.join(__dirname, 'templates')
  });

  for (var route in routes) {
    server.route(routes[route]);
}
});

// Start the server

models.sequelize.sync({force: true}).then(function() {
  server.start((err) => {

    if (err) {
      throw err;
    }
    console.log('Server running at:', server.info.uri);
  });
});
