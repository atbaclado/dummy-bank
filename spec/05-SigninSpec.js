const axios = require('axios');
const cheerio = require('cheerio');
const qs = require('qs');
const faker = require('faker');

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

describe('User Sign In', function() {
  var email = faker.internet.email()
  var password = faker.internet.password()

beforeEach(function() {
    this.root = 'http://localhost:3000/';
    this.url = this.root + 'signin';
});

  it('should handle POST requests', async function() {
      const response = await axios.post(this.url, qs.stringify({'email':email,'password':password, 'confirmation':'password'}));
      expect(response.status).toBeLessThan(400);
  });

  it('should sign in successfully', async function() {
    const response = await axios.post(this.url, qs.stringify({'email':'atbaclado@gmail.com','password':'flames'}));
    expect(response.request.res.responseUrl).toBe(this.root + 'profile');
  });

  it('should identify if email is incorrect', async function() {
    const response = await axios.post(this.url, qs.stringify({'email':email,'password':'flames'}));
    expect(response.request.res.responseUrl).toBe(this.root);
  });

  it('should identify if password is incorrect', async function() {
    const response = await axios.post(this.url, qs.stringify({'email':'atbaclado@gmail.com','password':password}));
    expect(response.request.res.responseUrl).toBe(this.root);
  });
});