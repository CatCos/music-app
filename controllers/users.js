'use strict'
const Joi = require('joi');
const Hapi = require('hapi');
const Promise = require('promise');
const models = require("../models");

const bcrypt = require('bcrypt');
const https = require('https')
const sequelize = require('sequelize')

/**
 * Creates a new user
 */
module.exports.create = (request, reply) => {

  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(request.payload.password, salt);

  models.user.findOne({
    atributes: ['id', 'username'],
    where: {
      username: request.payload.username
    }
  }).then((result) => {

    if (result == null) {
      models.user.create({
        username: request.payload.username,
        password: hash

      }).then(function(user) {
        return reply.view('index', {
          'invalid_user': 0,
          'wrong': 0,
          'user_created': 1
        });
      });
    } else {
      return reply.view('index', {
        'invalid_user': 1,
        'wrong': 0,
        'user_created': 0
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

    if (result.favorites != null) {
      if (result.favorites.length > 0) {
        favorites = JSON.parse(JSON.stringify(result.favorites));
      }
    }

    let artists = [];
    let isFavorite = false;

    for (let i = 0; i < results.length; i++) {
      isFavorite = isUserFavorite(results[i], favorites);

      artists.push({
        'mkid': results[i].mkid,
        'name': results[i].name,
        'photo': results[i].image,
        'is_favorite': isFavorite,
        'genres': results[i].genres
      });
    }

    reply(artists);
  });
};

/**
 * Verifies if artist is a favorite artist of the user
 */
const isUserFavorite = (artist, favorites) => {

  if (favorites.length == 0) {
    return false
  }
  for (let i = 0; i < favorites.length; i++) {
    if (favorites[i].mkid == artist.mkid) {
      return true
    }
  }

  return false
}

/**
 * Returns the favorite artists of the user
 */
module.exports.findFavorites = (request, reply) => {

  const user_id = request.auth.credentials.id;

  models.user.findOne({
    attributes: ['favorites'],
    where: {
      id: user_id
    }
  }).then((result) => {
    let favorites = []
    if (result.favorites != null) {
      favorites = JSON.parse(JSON.stringify(result.favorites));
      favorites = sortByKey(favorites, 'name');
    }

    return reply.view('user_favorites', {
      'favorites': favorites,
      'user': {
        username: request.auth.credentials.username
      }
    });
  });
}

/**
 * Sorts an array of objects by key
 */
function sortByKey(array, key) {
  return array.sort(function(a, b) {
    var x = a[key];
    var y = b[key];
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  });
}

/**
 * Adds a new favorite artist to the user
 */
module.exports.addFavorite = (request, reply) => {

  const data = request.payload
  const user_id = request.auth.credentials.id;

  let path = '/v1/artists/' + data.mkid + '/?&appkey=' + process.env.API_KEY + '&appid=' + process.env.API_ID;
  path = encodeURI(path)

  https.get({
    host: 'music-api.musikki.com',
    path: path,
  }, (response) => {
    let body = '';
    let artists = [];

    response.on('data', (d) => {
      body += d;
    });

    response.on('end', () => {
      let artist_information = JSON.parse(body);
      artist_information = artist_information.result

      models.user.findOne({
        attributes: ['favorites'],
        where: {
          id: user_id
        }
      }).then((result) => {
        models.user.findOne({
          attributes: ['favorites'],
          where: {
            id: user_id
          }
        }).then((result) => {
          let favorites = []

          var new_favorite = {
            'mkid': artist_information.mkid,
            'name': artist_information.name,
            'photo': artist_information.image
          }

          if (result.favorites != null) {
            if (result.favorites.length > 0) {
              favorites = result.favorites;
            }
          }

          const isFavorite = isUserFavorite(new_favorite, favorites)

          if (!isFavorite) {

            favorites.push(new_favorite)

            models.user.update({
              favorites: favorites
            }, {
              where: {
                id: user_id
              }
            }).then((result) => {

              reply({
                "error": false,
                "message": "success",
                "data": favorites
              });
            })
          }
        });
      });
    });
  });
};

/**
 * Removes favorite artist from the list of favorites of the user
 */
module.exports.deleteFavorite = (request, reply) => {

  const data = request.payload
  const user_id = request.auth.credentials.id;

  models.user.findOne({
    attributes: ['favorites'],
    where: {
      id: user_id
    }
  }).then((result) => {

    let favorites = JSON.parse(JSON.stringify(result.favorites));
    const isFavorite = isUserFavorite(data, favorites)

    if (isFavorite) {

      for (let i = favorites.length - 1; i >= 0; i--) {
        if (favorites[i].mkid == data.mkid) {
          favorites.splice(i, 1);
        }
      }

      models.user.update({
        favorites: favorites
      }, {
        where: {
          id: user_id
        }
      }).then((result) => {
        return reply({
          data: 'success'
        })
      });
    }
  });
};
