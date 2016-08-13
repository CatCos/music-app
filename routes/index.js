const auth = require('./auth');
const user = require('./users');
const search = require('./search');
const static = require('./static_files')
const fs = require('fs');
const path = require('path');
const basename = path.basename(module.filename);

const routes = fs.readdirSync(__dirname)
  .filter((file) => {
    return (file.indexOf('.') !== 0) && (file !== basename);
  })
  .map((file) => {
    return require(path.join(__dirname, file));
  });


module.exports = routes
