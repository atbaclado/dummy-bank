const assert = require('chai').assert;
const axios = require('axios');
const cheerio = require('cheerio');

describe('route: /signin', function() {
  beforeEach(function() {
      this.url = 'http://localhost:3000/signin';
  });

  it('should handle POST requests', async function() {
    const response = await axios.post(this.url, {
      email: 'atbaclado@gmail.com',
      password: 'flames'
    });
    // assert.equal(response.request.res.responseUrl, 'http://localhost:3000/profile');
    // assert.isBelow(response.status, 400);
  });

  it('should identify incorrect email', async function() {
    const response = await axios.post(this.url, {email: 'flames@gmail.com',  password: 'flames'});
    const $ = cheerio.load(response.data);
    // assert.equal(response.request.res.responseUrl, 'http://localhost:3000/');
    // assert.equal($('h3#signinMsg').text(), 'Incorrect email.');
  });

  it('should identify incorrect password', async function() {
    // const response = await axios.post(this.url, {email: 'atbaclado@gmail.com',  password: 'atbaclado'});
    // const $ = cheerio.load(response.data);
    // assert.equal($('h3#signinMsg').text(), 'Incorrect password.');
  });
});