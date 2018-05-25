const axios = require('axios');
const cheerio = require('cheerio');
const qs = require('qs');
const faker = require('faker');

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
const email = faker.internet.email()
const password = faker.internet.password()

describe('User Sign Up', function() {

  beforeEach(function() {
      this.root = 'http://localhost:3000/';
      this.url = this.root + 'signup';
  });

  it('should handle POST requests', async function() {
      const response = await axios.post(this.url, qs.stringify({'email':email,'password':password, 'confirmation':'password'}));
      expect(response.status).toBeLessThan(400);
  });

  it('should sign up successfully', async function() {
    const response = await axios.post( this.url, qs.stringify({'email':email,'password':password, 'confirmation':password}));
    expect(response.request.res.responseUrl).toBe(this.root+'profile');
  });

  it('should identify if email already in use', async function() {
    const response = await axios.post(this.url, qs.stringify({'email':email,'password':'flames', 'confirmation':'flames'}));
    expect(response.request.res.responseUrl).toBe(this.root);
  });

  it('should identify passwords do not match', async function() {
    const response = await axios.post(this.url, qs.stringify({'email':email,'password':password, 'confirmation':'flames'}));
    expect(response.request.res.responseUrl).toBe(this.root);
  });
});

module.exports.email = email;
module.exports.password = password;