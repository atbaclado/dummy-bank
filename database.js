const Sequelize = require('sequelize');

const connectionUrl = 'postgres://postgres:04031998@localhost:5432/bankdb';
const database = new Sequelize(connectionUrl);

module.exports = database;