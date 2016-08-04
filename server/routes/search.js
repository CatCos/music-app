const search = require("../handlers/search.js");

module.exports = [
    {
      method: 'POST',
      path: '/search/',
        handler: search.search
    }
];
