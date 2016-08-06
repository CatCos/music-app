const auth = require("../controllers/auth.js");

const Joi = require('joi');

module.exports = [
  {
    method: 'POST',
    path: '/login',
    config: {
      auth: false,
      validate: {
        payload: {
          username: Joi.string().required(),
          password: Joi.string().min(2).max(200).required()
        }
      },
      handler: auth.login,
      plugins: { 'hapi-auth-cookie': { redirectTo: false } }
    }
  },
  {
    method: 'POST',
    path: '/logout',
    config : {
      auth: 'session',
      handler: auth.logout
    }
  }
];
