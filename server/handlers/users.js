'use strict'
const Joi = require('joi');
const Hapi = require('hapi');

const models = require("../models");

module.exports.getFavoriteArtists = (artists, user_id, res) => {
  let results = [];
  models.user.findOne(
    {
      attributes: ['favorites'],
      where:
      {
        id: user_id
      }
    }).then((result) =>
    {
        let response = JSON.parse(JSON.stringify(result.favorites))


        for(let i = 0; i < artists.length; i++) {
          if (isFavorite(artists[i], response))
            results.push({'id' : artists[i].id, 'name' : artists[i].name, 'is_favorite' : true})
          else {
            results.push({'id' : artists[i].id, 'name' : artists[i].name, 'is_favorite' : false})
          }
        }


        console.log(results)
        res((results))
        return results
    });

};

function isFavorite(artist, favorites) {

  for(let i = 0; i < favorites.length; i++) {
    if(favorites[i].id == artist.id) {
      return true
    }
  }

  return false
}
