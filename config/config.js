module.exports = {
  "development": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASS,
    "database": "musikki",
    "host": process.env.DB_HOST,
    "dialect": "postgres",
    "seederStorage": "sequelize"
  },
  "test": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASS,
    "database": "musikki",
    "host": process.env.DB_HOST,
    "dialect": "postgres"
  },
  "production": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASS,
    "database": "musikki",
    "host": process.env.DB_HOST,
    "dialect": "postgres"
  }
};
