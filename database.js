const Sequelize = require('sequelize');

// format: "database://user:password@host:port/databasename"
const connectionUrl = 'postgres://postgres:postgres@localhost:5432/bankdb';
const database = new Sequelize(connectionUrl);

module.exports = database;