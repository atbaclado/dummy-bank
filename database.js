const Sequelize = require('sequelize');

// format: "database://user:password@host:port/databasename"
const connectionUrl = 'postgres://postgres:04031998@localhost:5432/bankdb';
const database = new Sequelize(connectionUrl);

module.exports = database;
