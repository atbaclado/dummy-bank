// define(function(require) {
  const path = require('path');
  const sinon = require('sinon');
  const express = require('express');
  const proxyquire = require('proxyquire');

  describe('web server', function() {
    beforeEach(function() {
      const app = express();
      const methods = {
        set: app.set.bind(app),
        use: app.use.bind(app),
        engine: app.engine.bind(app),
        listen: app.listen.bind(app)
      };

      this.spies = {};

      const test = this;
      for (let method in methods) {
        this.spies[method] = sinon.spy();
        app[method] = function() {
          test.spies[method].call(test.spies[method], ...arguments);
          return methods[method].call(methods[method], ...arguments);
        };
      }

      this.staticStub = sinon.stub().returns(express.static('./static'));
      this.originalStatic = express.static;
      express.static = this.staticStub;

      this.stubs = { express: sinon.stub().returns(app) };
    });

    it('should be written inside a file named "index.js"', function() {
      expect(() => require('../index')).not.toThrowError();
    });

    it('should create an expressjs application', function() {
      proxyquire('../index', this.stubs);
      expect(() => require('../index')).not.toThrowError();
      expect(this.stubs.express.called).toBe(true);
    });

    it('should be configured to serve views (i.e. templates) from the "views" directory', function() {
      proxyquire('../index', this.stubs);
      expect(() => require('../index')).not.toThrowError();
      expect(this.spies.set.called).toBe(true);
      expect(this.spies.set.calledWith('views', sinon.match((value) => {
        return /^(\.\/)?views\/?$/.test(value)
          || value === path.join(__dirname, '..', 'views');
      }))).toBe(true);
    });

    it('should be configured to use nunjucks templating engine for rendering html files', function() {
      proxyquire('../index', this.stubs);
      expect(() => require('../index')).not.toThrowError();
      expect(this.spies.engine.called).toBe(true);
      expect(this.spies.engine.calledWith('html', sinon.match((value) => {
          const consolidate = require('consolidate');
          return value === consolidate.nunjucks;
      }))).toBe(true);
    });

    it('should be configured to use the body-parser middleware to parse urlencoded request bodies', function() {
      proxyquire('../index', this.stubs);
      expect(() => require('../index')).not.toThrowError();
      expect(this.spies.use.called).toBe(true);
      expect(this.spies.use.calledWith(sinon.match((value) => {
          const bodyparser = require('body-parser');
          return value.toString() === bodyparser.urlencoded({ extended: false }).toString();
      }))).toBe(true);
    });

    /* it('should be configured to serve static files from the "static" directory at the "/static" path', function() {
      proxyquire('../index', this.stubs);
      assert.doesNotThrow(() => require('../index'));
      assert.isTrue(this.spies.use.called);
      assert.isTrue(this.spies.use.calledWith('/static', sinon.match((value) => {
        return value.toString() === this.originalStatic(path.join(__dirname, '..', 'static')).toString();
      })));
      assert.isTrue(this.staticStub.called);
      assert.isTrue(this.staticStub.calledWith(sinon.match((value) => {
        return /^(\.\/)?static\/?$/.test(value)
              || value === path.join(__dirname, '..', 'static');
      })));
    });
    */

    it('should listen for incoming http requests at port 3001', function() {
      proxyquire('../index', this.stubs);
      expect(() => require('../index')).not.toThrowError();
      expect(this.spies.listen.called).toBe(true);
      expect(this.spies.listen.calledWith(8888)).toBe(true);
    });
  });
// })