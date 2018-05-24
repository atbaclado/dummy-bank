const axios = require('axios');
const cheerio = require('cheerio');
const qs = require('qs');
const faker = require('faker');

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

describe('route: /signup', function() {
  var email = faker.internet.email()
  var password = faker.internet.password()

  beforeEach(function() {
      this.root = 'http://localhost:3001/';
      this.url = this.root + 'signup';
  });

  it('should handle POST requests', async function() {
      const response = await axios.post(this.url, qs.stringify({'email':email,'password':password, 'confirmation':'password'}));
      expect(response.status).toBeLessThan(400);
  });

  it('should sign in successfully', async function() {
    const response = await axios.post( this.url, qs.stringify({'email':'atbaclado@gmail.com','password':'flames'}));
    expect(response.request.res.responseUrl).toBe(this.root+'profile');
  });

  it('should identify if email not in use', async function() {
    const response = await axios.post(this.url, qs.stringify({'email':email,'password':'flames', 'confirmation':'flames'}));
    expect(response.request.res.responseUrl).toBe(this.root);
  });

  it('should identify passwords do not match', async function() {
    const response = await axios.post(this.url, qs.stringify({'email':'atbaclado@gmail.com','password':password, 'confirmation':'flames'}));
    expect(response.request.res.responseUrl).toBe(this.root);
  });
});