const http = require("http"); 
const orm = require("orm");
const pg = require("pg"); 

// format: "database://user:password@host:port/databasename"
var connestString = "postgres://postgres:postgres@localhost:5432/bankdb";
jasmine.DEFAULT_TIMEOUT_INTERVAl

describe('Database Setup', function() {
    
  describe('Database is found', function () {
    it('bankdb should be created already', function (done) {
      orm.connect(connestString, function (err) {
        if (err) throw err;
        done();
      });
    });
  });

  var knex = require('knex')({
    client: 'pg',
    version: '6.4.2',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : '04031998',
      database : 'bankdb'
    }
  });

  describe('Database Schema', function () {
    var originalTimeout;

    beforeEach(function() {
      originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
    });

    afterEach(function() {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    it('database should have users table', function (done) {     
      knex.schema.hasTable('users').then(function(exists, err) {
        if(!exists) throw err;
        done();
      }).catch(function (err) {
        throw "err";
      })
    });

    it('users table should have email column', function (done) {     
      knex.schema.hasColumn('users', 'email').then(function(exists, err) {
        if(!exists) throw err
        done();
      }).catch(function (err) {
        throw err;
      })
    });

    it('users table should have name column', function (done) {     
      knex.schema.hasColumn('users', 'name').then(function(exists, err) {
        if(!exists) throw err
        done();
      }).catch(function (err) {
        throw err;
      })
    });

    it('users table should have password column', function (done) {     
      knex.schema.hasColumn('users', 'password').then(function(exists, err) {
        if(!exists) throw err
        done();
      }).catch(function (err) {
        throw err;
      })
    });

    it('database should have accounts table', function (done) {   
      knex.schema.hasTable('accounts').then(function(exists, err) {
        if(!exists) throw err;
        done();
      }).catch(function (err) {
        throw err;           
      });
    });

    it('accounts table should have user_id column', function (done) {     
      knex.schema.hasColumn('accounts', 'user_id').then(function(exists, err) {
        if(!exists) throw err
        done();
      }).catch(function (err) {
        throw err;
      })
    });

  it('accounts table should have balance column', function (done) {     
      knex.schema.hasColumn('accounts', 'balance').then(function(exists, err) {
        if(!exists) throw err
        done();
      }).catch(function (err) {
        throw err;
      })
    });
  });
});