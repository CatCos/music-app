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

        return reply.view('index', {
          'invalid_user' : 1,
          'wrong' : 0,
          'user_created' : 1
          });
      });
    }
    else {
      return reply.view('index', {
        'invalid_user' : 1,
        'wrong' : 0,
        'user_created' : 0
      });
    }
  });
};


/**
 * Returns a list of artists, with indication if they are a favorite of the user
 * or not
 */
module.exports.getFavoriteArtists = (results, user, reply) => {
  models.user.findOne({
      attributes: ['favorites'],
      where: {
        id: user.id
      }
    }).then((result) => {
        let favorites = [];
        if(result.favorites.length > 0){
          favorites = JSON.parse(JSON.stringify(result.favorites));
        }

        let artists = [];
        let isFavorite = false;

        for(let i = 0; i < results.length; i++) {
          isFavorite = isUserFavorite(results[i], favorites);
          artists.push({
            'id' : results[i].mkid,
            'name' : results[i].name,
            'photo' : results[i].image,
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

  if(favorites.length == 0) {
    return false
  }
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

  const user_id = request.auth.credentials.id;

  models.user.findOne({
    attributes: ['favorites'],
    where: {
      id: user_id
    }
  }).then((result) => {
      let favorites = JSON.parse(JSON.stringify(result.favorites));

      return reply.view('user_favorites', {
        'favorites' : favorites,
        'user' : {username: request.auth.credentials.username}
      });

  });

}

module.exports.addFavorite = (request, reply) => {

  const data = request.payload
  const user_id = 2;

  models.user.findOne({
    attributes: ['favorites'],
    where: {
      id: user_id
    }
  }).then((result) => {
    let favorites = []
      if(result.favorites.length > 0) {
        favorites = JSON.parse(result.favorites);
      }

      const isFavorite = isUserFavorite(data, favorites)

      if(!isFavorite) {

        favorites.push({'id' : data.mkid, 'name': data.name})

        models.user.update(
        {
          favorites : favorites
        }, {
        where: {
          id: user_id
        }
        }).then((result) => {

          reply({
            "error" : false,
            "message" : "success",
            "data" : favorites
          });
        })
      }

    });
};

module.exports.deleteFavorite = (request, reply) => {

  const data = request.payload
  const user_id = request.auth.credentials.id;

  console.log(data)
  models.user.findOne({
    attributes: ['favorites'],
    where: {
      id: user_id
    }
  }).then((result) => {

      let favorites = JSON.parse(JSON.stringify(result.favorites));
      const isFavorite = isUserFavorite(data, favorites)

      if(isFavorite) {

        for(let i = favorites.length-1; i >= 0; i--) {
            if(favorites[i].id == data.mkid) {
            favorites.splice(i, 1);
          }
        }

        models.user.update(
        {
          favorites : favorites
        }, {
        where: {
          id: user_id
        }
        }).then((result) => {
          return  reply({data:'success'})

        });
      }

    });
};
