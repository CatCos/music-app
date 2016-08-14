'use strict'
const Joi = require('joi');
const Hapi = require('hapi');
const https = require('https')
const users = require('./users.js')
const models = require("../models");
const Wreck = require('wreck');

/**
 * Returns artist that match a given string
 **/

module.exports.searchByArtist = (request, reply) => {

  const query = request.payload;

  query.artist = query.artist.replace('&', 'e')
  let path = 'https://music-api.musikki.com/v1/artists?q=[artist-name:' +
    query.artist + ']&appkey=' + process.env.API_KEY + '&appid=' +
    process.env.API_ID;
  path = encodeURI(path)

  Wreck.get(path, {
    acceptEncoding: false
  }, (err, res, payload) => {

    const results = JSON.parse(payload.toString())
    users.getFavoriteArtists(results.results, request.auth.credentials, reply)
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
