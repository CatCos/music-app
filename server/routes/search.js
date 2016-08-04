const search = require("../controllers/search.js");

module.exports = [{
      method: 'POST',
      path: '/search/',
      handler: search.searchByArtist
    }
];
