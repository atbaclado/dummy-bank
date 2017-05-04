const express = require('express');
const bodyparser = require('body-parser');
const cookieparser = require('cookie-parser');
const consolidate = require('consolidate');
const database = require('./database');
const User = require('./models').User;
const Account = require('./models').Account;

const app = express();

app.engine('html', consolidate.nunjucks);
app.set('views', './views');

app.use(bodyparser.urlencoded());
app.use(cookieparser());

app.use('/static', express.static('./static'));
app.use(require('./auth-routes'));

app.get('/', function(req, res) {
	res.render('index.html');
});

app.get('/profile', requireSignedIn, function(req, res) {
	const email = req.cookies.currentUser;
	User.findOne({ where: { email: email } }).then(function(user) {
		res.render('profile.html', {
			user: user
		});
	});
});

app.post('/transfer', requireSignedIn, function(req, res) {
	const recipient = req.body.recipient;
	const amount = parseInt(req.body.amount, 10);

	const email = req.cookies.currentUser;
	User.findOne({ where: { email: email } }).then(function(sender) {
		User.findOne({ where: { email: recipient } }).then(function(receiver) {
			Account.findOne({ where: { user_id: sender.id } }).then(function(senderAccount) {
				Account.findOne({ where: { user_id: receiver.id } }).then(function(receiverAccount) {
					database.transaction(function(t) {
						return senderAccount.update({
							balance: senderAccount.balance - amount
						}, { transaction: t }).then(function() {
							return receiverAccount.update({
								balance: receiverAccount.balance + amount
							}, { transaction: t });
						});
					}).then(function() {
						console.log('Transferred ' + amount + ' to ' + recipient);
						res.redirect('/profile');
					});
				});
			});
		});
	});
});

function requireSignedIn(req, res, next) {
    if (!req.cookies.currentUser) {
        return res.redirect('/');
    }
    next();
}

app.listen(3000, function() {
	console.log('Server is now running at port 3000');
});
