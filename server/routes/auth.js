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
      handler: auth.login
    }
  },
  {
    method: 'GET',
    path: '/logout',
    config : {
      handler: auth.logout
    }
  }
];
