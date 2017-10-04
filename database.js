const Sequelize = require('sequelize');

const connectionUrl = 'postgres://postgres:postgres@localhost:5432/bankdb';
const database = new Sequelize(connectionUrl);

module.exports = database;