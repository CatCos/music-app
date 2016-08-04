'use strict'
const Joi = require('joi');
const Hapi = require('hapi');
const https = require('https')
const users = require('./users.js')
const models = require("../models");

/**
 * Returns artist that match a given string
 **/
const searchArtist = (searchBy, reply) => {
  console.log("ola")
  let path =  '/v1/artists?q=' + searchBy.artist + '&appkey=8954824&appid=8954824';
  path = path.replace(/\s/g, "+")
  console.log(path)
  https.get({
    host: 'music-api.musikki.com',
    path : path,
  }, (response) => {
        // Continuously update stream with data
        let body = '';
        let artists = [];

        response.on('data', (d) => {
            body += d;
        });

        response.on('end', () => {
            let results = JSON.parse(body).results;
            for(let i = 0; i < results.length; i++) {
              artists.push({'id' : results[i].mkid, 'name' : results[i].name});

            }

            let final_results = users.getFavoriteArtists(artists, 4, reply)
        });
    }).on('error', (e) => {
      reply(new Error(e));
    });
};


module.exports.search = (request, reply) => {
  searchArtist(request.payload, reply)



}
