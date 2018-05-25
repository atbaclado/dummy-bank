const axios = require('axios');
const cheerio = require('cheerio');
const qs = require('qs');
const email = require('./04-SignupSpec').email
const password = require('./04-SignupSpec').password

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

describe('User Sign In', function() {
beforeEach(function() {
    this.root = 'http://localhost:3000/';
    this.url = this.root + 'signin';
});

  it('should handle POST requests', async function() {
      const response = await axios.post(this.url, qs.stringify({'email':email,'password':password}));
      expect(response.status).toBeLessThan(400);
  });

  it('should sign in successfully', async function() {
    const response = await axios.post(this.url, qs.stringify({'email':email,'password':password}));
    expect(response.request.res.responseUrl).toBe(this.root + 'profile');
  });

  it('should identify if email is incorrect', async function() {
    const response = await axios.post(this.url, qs.stringify({'email':'email@gmail.com','password':password}));
    expect(response.request.res.responseUrl).toBe(this.root);
  });

  it('should identify if password is incorrect', async function() {
    const response = await axios.post(this.url, qs.stringify({'email':email,'password':'password'}));
    expect(response.request.res.responseUrl).toBe(this.root);
  });
});