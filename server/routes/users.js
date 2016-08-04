const user = require("../handlers/users.js");

module.exports = [
    {
      method: 'GET',
      path: '/users/create',
      handler: user.new
    }
];
