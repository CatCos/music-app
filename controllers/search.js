'use strict'
const Joi = require('joi');
const Hapi = require('hapi');
const https = require('https')
const users = require('./users.js')
const models = require("../models");

/**
 * Returns artist that match a given string
 **/

module.exports.searchByArtist = (request, reply) => {

  const query = request.payload;

  query.artist = query.artist.replace('&', 'e')
  let path = '/v1/artists?q=[artist-name:' + query.artist + ']&appkey=' + process.env.API_KEY + '&appid=' + process.env.API_ID;
  path = encodeURI(path)

  https.get({
    host: 'music-api.musikki.com',
    path: path,
  }, (response) => {
    // Continuously update stream with data
    let body = '';
    let artists = [];

    response.on('data', (d) => {
      body += d;
    });

    response.on('end', () => {
      let results = JSON.parse(body).results;

      users.getFavoriteArtists(results, request.auth.credentials, reply)
    });

  }).on('error', (e) => {
    reply(new Error(e));
  });

}

/**
 * Returns html of search page
 */
module.exports.getSearchPage = (request, reply) => {

  return reply.view('search', {
    'user': {
      username: request.auth.credentials.username
    },
    'artist': null
  });
};
