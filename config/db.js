const { Sequelize } = require('sequelize');

// Create a new Sequelize instance
const sequelize = new Sequelize('your_database_name', 'your_username', 'your_password', {
  host: 'localhost',
  dialect: 'postgres',
});

module.exports = sequelize;