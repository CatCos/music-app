const Hapi = require('hapi');
const Joi = require('joi');
const routes = require('./routes');
const models = require('./models');
const Sequelize = require('sequelize')
const Jade = require('jade');
// Create a server with a host and port
const server = new Hapi.Server();

require('dotenv').config();

server.connection({
    host: 'localhost',
    port: 8000
});

server.route(routes);

  server.views({
    engines: {
        jade: Jade
    },
    path: Path.join(__dirname, 'templates')
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
