'use strict'
const Joi = require('joi');
const Hapi = require('hapi');
const Promise = require('promise');
const models = require("../models");

const bcrypt = require('bcrypt');


module.exports.create = (request, reply) => {

  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(request.payload.password, salt);

  models.user.findOne({
    atributes : ['id', 'username'],
    where : {
      username : request.payload.username
    }
  }).then((result) => {

    if(result == null) {
      models.user.create(
      {
        username: request.payload.username,
        password : hash

      }).then(function(user)
      {
        reply({
          "error" : false,
          "message" : "success",
          "data" : "USER INSERTED"});
      });
    }
    else {
      reply({
        "error" : true,
        "message" : "failed",
        "data" : "USER ALREADY EXISTS"});
    }
  });
};


/**
 * Returns a list of artists, with indication if they are a favorite of the user
 * or not
 */
module.exports.getFavoriteArtists = (results, user_id, reply) => {

  models.user.findOne({
      attributes: ['favorites'],
      where: {
        id: user_id
      }
    }).then((result) => {
        let favorites = JSON.parse(JSON.stringify(result.favorites));
        let artists = [];
        let isFavorite = false;

        for(let i = 0; i < results.length; i++) {
          isFavorite = isUserFavorite(results[i], favorites);
          artists.push({
            'id' : results[i].mkid,
            'name' : results[i].name,
            'is_favorite' : isFavorite
          });
        }

        reply(artists);
    });
};

/**
 * Verifies if artist is a favorite artist of the user
 */
const isUserFavorite = (artist, favorites) => {

  for(let i = 0; i < favorites.length; i++) {
    if(favorites[i].id == artist.mkid) {
      return true
    }
  }

  return false
}

/**
  * Returns the favorites artists of the user
  */
module.exports.findFavorites = (request, reply) => {

  const user_id = 1

  models.user.findOne({
    attributes: ['favorites'],
    where: {
      id: user_id
    }
  }).then((result) => {
      let favorites = JSON.parse(JSON.stringify(result.favorites));

      reply(favorites)
  });

}
