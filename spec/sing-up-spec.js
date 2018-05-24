const axios = require('axios');
const cheerio = require('cheerio');
const qs = require('qs');
const faker = require('faker');

var email = faker.internet.email()
var password = faker.internet.password()
var base_url = 'http://localhost:3001/';
      

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
describe('route: /signup', function() {
  let config = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };

  beforeEach(function() {
      this.url = base_url+'signup'
  });

  it('should handle POST requests', async function() {
      const response = await axios.post(this.url, qs.stringify({'email':email,'password':password, 'confirmation':'password'}));
      expect(response.status).toBe(200);
  });

  it('should sign up successfully', async function() {
    const response = await axios.post( this.url, qs.stringify({'email':email,'password':password, 'confirmation':password}));
    expect(response.request.res.responseUrl).toBe(base_url+'profile');
  });
});