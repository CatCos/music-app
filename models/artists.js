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
    type : {
      type: DataTypes.STRING,
      allowNull: true
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
    },
    country : {
      type : DataTypes.STRING,
      allowNull: true
    },
    start_date : {
      type : DataTypes.DATEONLY,
      allowNull : true
    },

    current_members : {
      type: DataTypes.ARRAY(DataTypes.JSON),
      allowNull : true

    }
  });
  return Artist;
};
