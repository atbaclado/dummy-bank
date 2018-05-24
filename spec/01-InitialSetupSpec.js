define(['index'], function(App, $, _) {
  const http = require("http"); 
  const orm = require("orm");

  describe('initial setup', function() {
    describe('should install dependencies and save then to package.json:', function() {
      const dependencies = require('../package.json').dependencies;

      it('should install "express", the web framework based on nodejs', function() {
        expect(dependencies.hasOwnProperty('express')).toBe(true);
        expect(() => require('express')).not.toThrowError();
      });

      it('should install "body-parser", for parsing http request bodies', function() {
        expect(dependencies.hasOwnProperty('body-parser')).toBe(true);
        expect(() => require('body-parser')).not.toThrowError();
      });

      it('should install "nunjucks", for rendering templates', function() {
        expect(dependencies.hasOwnProperty('nunjucks')).toBe(true);
        expect(() => require('nunjucks')).not.toThrowError();
      });

      it('should install "consolidate", to make nunjucks compatible with express', function() {
        expect(dependencies.hasOwnProperty('consolidate')).toBe(true);
        expect(() => require('consolidate')).not.toThrowError();
      });

      it('should install "pg", database for storing information', function() {
        expect(dependencies.hasOwnProperty('pg')).toBe(true);
        expect(() => require('pg')).not.toThrowError();
      });
    });
  });
})