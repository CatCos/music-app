'use strict';
module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },

    password : {
      type: DataTypes.STRING,
      allowNull: false
    },

    favorites : {
      type : DataTypes.JSON,
      allowNull : true
    }

  });

  return User;
};