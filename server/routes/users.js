const user = require("../controllers/users.js");

module.exports = [
    {
      method: 'GET',
      path: '/users/create',
      handler: user.new
    }
];
