const axios = require('axios');
const cheerio = require('cheerio');
const qs = require('qs');
const faker = require('faker');
var ondone = require('ondone');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

var email = faker.internet.email()
var password = faker.internet.password()

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

describe('route: /signup', function() {
  let config = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };

  beforeEach(function() {
    this.root = 'http://localhost:3001/';
    this.url = this.root + 'signup';
  });

  it('should handle POST requests', async function() {
    var doneFn = jasmine.createSpy("success");
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(args) {
      if (this.readyState == this.DONE) {
        doneFn(this.status);
      }
    };
    xhr.open("POST", this.url);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(qs.stringify({'email':email,'password':password, 'confirmation':'password'}));
    expect(xhr.status).toBeLessThan(400);
  });

  it('should sign up successfully', async function() {
    var doneFn = jasmine.createSpy("success");
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(args) {
      if (this.readyState == this.DONE) {
        doneFn(this.status);
      }
    };
    xhr.open("POST", this.url);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(qs.stringify({'email':email,'password':password, 'confirmation':password}));
    expect(xhr.status).toBe(200);
  });

  // it('should identify if email already in use', async function() {
  //   const response = await axios.post(this.url, qs.stringify({'email':email,'password':'flames', 'confirmation':'flames'}));
  //   expect(response.request.res.responseUrl).toBe(this.root);

  //   /*const $ = cheerio.load(response.data);
  //   assert.equal($('h3#signupMsg').text(), 'Email is already in use.');*/
  // });

  // it('should identify passwords do not match', async function() {
  //   const response = await axios.post(this.url, qs.stringify({'email':email,'password':password, 'confirmation':'flames'}));
  //   expect(response.request.res.responseUrl).toBe(this.root);

  //  /* const $ = cheerio.load(response.data);
  //   assert.equal($('h3#signupMsg').text(), 'Passwords do not match.');*/
  // });
});