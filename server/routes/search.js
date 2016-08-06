const search = require("../controllers/search.js");

module.exports = [{
      method: 'POST',
      path: '/search',
      config : {
        auth: 'session',
        handler: search.searchByArtist
      }
    }
];
