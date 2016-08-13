const auth = require('./auth');
const user = require('./users');
const search = require('./search');
const static = require('./static_files')
const fs        = require('fs');
var path      = require('path');
const basename  = path.basename(module.filename);
let route = []

const routes = fs.readdirSync(__dirname)
.filter((file) => {
    return (file.indexOf('.') !== 0) && (file !== basename);
})
.map((file) => {
    return require(path.join(__dirname, file));
});




//module.exports = [].concat(index, auth, user, search);
module.exports = routes
