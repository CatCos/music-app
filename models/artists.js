'use strict';
module.exports = function(sequelize, DataTypes) {
  const Artist = sequelize.define('artist', {
    mkid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    summary: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    genres : {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true
    }
  });
  return Artist;
};
