const artist = require("../controllers/artists.js");

module.exports = [{
  method: 'GET',
  path: '/artist/{mkid}',
  config: {
    auth: {
      strategy: 'session'
    },
    handler: artist.getArtistInformation,
    plugins: {
      'hapi-auth-cookie': {
        redirectTo: '/'
      }
    }
  }
}];
