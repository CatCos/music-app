const Hapi = require('hapi');
const Joi = require('joi');
const routes = require('./routes');
const models = require('./models');
const Sequelize = require('sequelize')
// Create a server with a host and port
const server = new Hapi.Server();


server.connection({
    host: 'localhost',
    port: 8000
});

server.route(routes);



// Start the server

models.sequelize.sync().then(function() {
  server.start((err) => {

      if (err) {
          throw err;
      }
      console.log('Server running at:', server.info.uri);
  });
});
