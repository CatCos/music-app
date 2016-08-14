const Joi = require('joi');
const models = require("../models");
const bcrypt = require('bcrypt');

/**
 * Manages login
 */
module.exports.login = (request, reply) => {
  getValidatedUser(request.payload.username, request.payload.password)
    .then((user) => {

      if (user != null) {

        request.cookieAuth.set(user);
        return reply.redirect('/user/' + user.username + '/favorites');
      } else {

        return reply.view('index', {
          'invalid_user': 0,
          'wrong': 1,
          'user_created': 0
        });
      }
    })
    .catch((err) => {
      
      return reply({
        'error': err
      });
    });
};

/**
 * Verifies user's password
 */
const getValidatedUser = (username, password) => {
  return new Promise((fulfill, reject) => {

    models.user.findOne({
      where: {
        username: username
      }
    }).then((result) => {
      if (result != null) {
        bcrypt.compare(password, result.password, (err, res) => {
          if (res == true) {
            return fulfill({
              'id': result.id,
              'username': result.username
            });
          } else {
            return fulfill(null);
          }
        });
      } else {
        return reject({
          "error": true,
          "message": "failed",
          "data": "USER DOES NOT EXISTS"
        });
      }
    });
  });
}

/**
 * Manages logout
 */

module.exports.logout = (request, reply) => {
  request.cookieAuth.clear();
  return reply.redirect('/')

};
