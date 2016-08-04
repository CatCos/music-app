'use strict'
const Joi = require('joi');
const Hapi = require('hapi');
const https = require('https')
const users = require('./users.js')
const models = require("../models");

/**
 * Returns artist that match a given string
 **/
function searchArtist(searchBy, res) {

  let path =  '/v1/artists?q=' + searchBy.artist + '&appkey=123456789&appid=123456789';
  path = path.replace(/\s/g, "+")

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

            let results = JSON.parse(body).results

            for(let i = 0; i < results.length; i++) {
              artists.push({'id' : results[i].mkid, 'name' : results[i].name})

            }

            let final_results = users.getFavoriteArtists(artists, 4, res)
        });
    });
};


module.exports.search = (request, response) => {
  searchArtist(request.payload, response)



}
