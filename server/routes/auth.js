const auth = require("../handlers/auth.js");

module.exports = [
    {
      method: 'POST',
      path: '/login',
      handler: auth.login
    },
    {
      method: 'POST',
      path: '/logout',
      handler: auth.logout
    }
];
