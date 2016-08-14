'use strict'
const Joi = require('joi');
const Hapi = require('hapi');
const Promise = require('promise');
const Wreck = require('wreck');
const bcrypt = require('bcrypt');
const https = require('https')
const sequelize = require('sequelize')

const models = require("../models");

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
  }).then((user) => {

    if (user == null) {
      models.user.create({
        username: request.payload.username,
        password: hash

      }).then((user) => {
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
    where: {
      id: user.id
    }
  }).then((user) => {
    let artists = [];
    user.getFavorites().then((favorites) => {

      if (favorites != null) {
        for (let i = 0; i < results.length; i++) {

          isUserFavorite(results[i], favorites).then((result) => {
            artists.push({
              'mkid': results[i].mkid,
              'name': results[i].name,
              'photo': results[i].image,
              'is_favorite': result.isFavorite,
              'genres': results[i].genres
            });

            if (i == results.length - 1) {
              reply(artists);
            }
          });
        }
      }
    });
  });
};

/**
 * Returns the favorite artists of the user
 */
module.exports.findFavorites = (request, reply) => {

  const user_id = request.auth.credentials.id;

  models.user.findOne({
    where: {
      id: user_id
    }
  }).then((user) => {

    user.getFavorites().then((favorites) => {

      let artists_results = []
      if (favorites.length == 0) {
        return reply.view('user_favorites', {
          'favorites': favorites,
          'user': {
            username: request.auth.credentials.username
          }
        });
      }

      favorites.forEach((favorite, index) => {
        favorite.getArtist().then((artist_information) => {

          artists_results.push({
            'mkid': artist_information.mkid,
            'name': artist_information.name,
            'summary': artist_information.summary,
            'photo': artist_information.photo,
            'genres': artist_information.genres
          })

          if (artists_results.length == favorites.length) {
            favorites = sortByKey(artists_results, 'name');

            return reply.view('user_favorites', {
              'favorites': artists_results,
              'user': {
                username: request.auth.credentials.username
              }
            });
          }
        });
      });
    });
  });
}


/**
 * Sorts an array of objects by key
 */
const sortByKey = (array, key) => {
  return array.sort((a, b) => {
    let x = a[key];
    let y = b[key];
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  });
}

/**
 * Adds a new favorite artist to the user
 */
module.exports.addFavorite = (request, reply) => {

  const data = request.payload
  const user_id = request.auth.credentials.id;

  let path = 'https://music-api.musikki.com//v1/artists/' + data.mkid +
    '/?&appkey=' + process.env.API_KEY + '&appid=' + process.env.API_ID;

  path = encodeURI(path)

  Wreck.get(path, {
    acceptEncoding: false
  }, (err, res, payload) => {

    let artist_information = JSON.parse(payload.toString())
    artist_information = artist_information.result

    let genres = [];
    for (let i = 0; i < artist_information.genres.length; i++) {
      genres.push(artist_information.genres[i].name)
    }

    models.artist.findOrCreate({
      defaults: {
        mkid: artist_information.mkid,
        name: artist_information.name,
        summary: artist_information.bio.summary,
        photo: artist_information.image,
        genres: genres
      },
      where: {
        mkid: artist_information.mkid
      }
    }).then((artist, created) => {

      models.favorite.findOrCreate({
        defaults: {
          userId: user_id,
          artistId: artist[0].id
        },
        where: {
          userId: user_id,
          artistId: artist[0].id
        }
      }).then((favorite) => {

        reply({
          "error": false,
          "message": "success",
          "data": favorite
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
    where: {
      id: user_id
    }
  }).then((user) => {

    user.getFavorites().then((favorites) => {
      isUserFavorite(data, favorites).then((user_favorite) => {

        if (user_favorite.isFavorite) {

          models.favorite.destroy({
            where: {
              id: user_favorite.id
            }
          }).then((result) => {

            return reply({
              user: request.auth.credentials.username
            })
          });
        }
      });
    });
  });
};

/**
 * Verifies if artist is a favorite artist of the user
 */
const isUserFavorite = (artist, favorites) => {

  return new Promise((fulfill, reject) => {
    if (favorites.length == 0) {
      return fulfill({
        isFavorite: false,
        id: null
      })
    }

    favorites.forEach((favorite, index) => {
      favorite.getArtist().then((artist_information) => {

        if (artist_information.mkid == artist.mkid) {

          return fulfill({
            isFavorite: true,
            id: favorite.id
          })
        } else if (index == (favorites.length - 1)) {

          return fulfill({
            isFavorite: false,
            id: null
          })
        }
      });
    });
  });
};
