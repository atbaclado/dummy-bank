// var assert = require('chai').assert;
// var sinon = require('sinon');
// var PassThrough = require('stream').PassThrough;
// var https = require('https');
// var api = require('../api.js');
 
// describe('api', function() {
// 	beforeEach(function() {
// 		this.request = sinon.stub(http, 'request');
// 	});
 
// 	afterEach(function() {
// 		http.request.restore();
// 	});
 
// 	it('should send post params in request body', function() {
// 		var params = { email: 'atbaclado@gmail.com', password: 'flames' };
// 		var expected = JSON.stringify(params);
// 		var request = new PassThrough();
// 		var write = sinon.spy(request, 'write');
// 		this.request.returns(request);
// 		// api.post(params, function() { });
// 		var req = https.request({
// 			hostname: 'localhost:3000',
// 			path: '/signin',
// 			method: 'POST'
// 		}, function(response) {
// 			var data = '';
// 			response.on('data', function(chunk) {
// 				data += chunk;
// 			});
 
// 			response.on('end', function() {
// 				callback(null, JSON.parse(data));
// 			});
// 		});
// 		assert(write.withArgs(expected).calledOnce);
// 	});
// });

// var formData = qs.stringify({'email':'atbaclado@gmail.com','password':'flames'});
// var contentLength = formData.length;

// const response = await request({
//   headers: {
//     'Content-Length': contentLength,
//     'Content-Type': 'application/x-www-form-urlencoded'
//   },
//   uri: this.url,
//   body: formData,
//   method: 'POST'
// }, function (error, res, body) {
//   console.log('error:', error); // Print the error if one occurred
//   console.log('statusCode:', res && res.statusCode); // Print the response status code if a response was received
//   console.log('body:', body); // Print the HTML for the Google homepage.
// });

// var post_data = qs.stringify({
//       'email' : 'atbaclado@gmail.com',
//       'password': 'flames',
//     });

//     var post_options = {
//       host: 'localhost:3000',
//       port: '80',
//       path: '/signin',
//       method: 'POST',
//       headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//           'Content-Length': Buffer.byteLength(post_data)
//       }
//     };

//     var post_req = http.request(post_options, function(res) {
//       res.setEncoding('utf8');
//       res.on('data', function (chunk) {
//           console.log('Response: ' + chunk);
//       });
//     });

//     post_req.write(post_data);
//     post_req.end()

// const request = require('supertest');
// const agent   = request.agent("http://localhost:3000");
// var loginDetails = {'email':'atbaclado@gmail.com','password':'flames'};
//     const response = await agent
//       .post('/signin')
//       .type('form')
//       .send(loginDetails)
      // .field('email', 'atbaclado@gmail.com')
      // .field('password', 'flames')
      // .expect('Location','http://localhost:3000/')
      // .end(function(err, res) {
      //   if (err || !res.ok) {
      //     alert('Oh no! error');
      //   }else {
      //     alert('yay got ' + JSON.stringify(res.body));
      //   }
      // });
    // console.log(response);