'use strict';
module.exports = function(sequelize, DataTypes) {
  const Favorite = sequelize.define('favorite', {}, {
    classMethods: {
      associate: function(models) {

        Favorite.belongsTo(models.user);
        Favorite.belongsTo(models.artist);
      }
    }
  });
  return Favorite;
};
