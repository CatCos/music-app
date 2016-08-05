'use strict'
const Joi = require('joi');
const Hapi = require('hapi');
const Promise = require('promise');
const models = require("../models");

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

        //res((artists))

        reply(artists);
    });
};

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
