const Joi = require('joi');
const models = require("../models");
const bcrypt = require('bcrypt');

module.exports.login = (request, reply) => {
  getValidatedUser(request.payload.username, request.payload.password)
  .then(function(user){

    if (user != null) {
      request.cookieAuth.set(user);

      return reply.redirect('/users/favorites');
    } else {
      return reply({'error' :'Bad email or password'});
    }
  })
  .catch(function(err){
    console.log(err)
    return reply({'error' :err});
  });
};

function getValidatedUser(username, password){
    return new Promise(function(fulfill, reject){

      models.user.findOne({
        attributes :  ['id', 'username', 'password'],
          where: {
            username: username
          }
        }).then((result) => {
          if(result != null) {
            bcrypt.compare(password, result.password, function(err, res) {
              if(res == true) {
                return fulfill({
                  'id' : result.id,
                  'username' : result.username});
              }
              else {
                  return fulfill(null);
              }
            });
          }
          else {
            return reject({
              "error" : true,
              "message" : "failed",
              "data" : "USER DOES NOT EXISTS"});
          }
      });
    });
}

module.exports.logout = (request, reply) => {
  request.cookieAuth.clear();
  //return reply.redirect('/');
  return reply.redirect('/')

};
