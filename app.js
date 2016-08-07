const Hapi = require('hapi');
const Joi = require('joi');
const routes = require('./routes');
const models = require('./models');
const Sequelize = require('sequelize')
const Jade = require('jade');
const Path = require('path')
// Create a server with a host and port
const server = new Hapi.Server({port: process.env.PORT, host: '0.0.0.0'});

//server.connection({
//    host: process.env.HOST,
//    port: 8000
//});

server.register([require('hapi-auth-cookie'),
                require('inert'),
                require('vision')], (err) => {

    server.auth.strategy('session', 'cookie', {
      password: 'secret',
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

    server.route(routes);
});

// Start the server

models.sequelize.sync().then(function() {
  server.start((err) => {

      if (err) {
          throw err;
      }
      console.log('Server running at:', server.info.uri);
  });
});
