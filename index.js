const express = require('express');
const bodyparser = require('body-parser');
const cookieparser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');
const consolidate = require('consolidate');
const database = require('./database');
const User = require('./models').User;
const Account = require('./models').Account;

const app = express();
const radix = 10;

app.set('views', './views');
app.engine('html', consolidate.nunjucks);

app.use(bodyparser.urlencoded({ extended: false }))
app.use(cookieparser('secret-cookie'));
app.use(session({ resave: false, saveUninitialized: false, secret: 'secret-cookie' }));
app.use(flash());

app.use(express.static('./static'));
app.use(require('./routes/auth'));
app.use(require('./routes/twitter'));
app.use(require('./routes/google'));

var user = function retrieveSignedInUser(req,res,next) {
	req.user = req.session.currentUser;
	next();
};

app.use(user);

app.get('/', function(req, res) {
	res.render('index.html');
});

app.get('/profile', function(req, res) {
	User.findOne({ where: { email: req.user } }).then(function(user) {
		res.render('profile.html', {
			user: user
		});
	});
});

app.post('/transfer', requireSignedIn, function(req, res) {
	const recipient = req.body.recipient;
	const amount = parseInt(req.body.amount, radix);

	if(amount <= 0) {
		req.flash('statusMessage', 'Invalid amount');
		res.redirect('/profile');
	}

	var query1 = "SELECT user_id, balance FROM accounts WHERE user_id IN (SELECT id FROM users WHERE email = " + "'" + req.user + "')";
	var query2 = "SELECT user_id, balance FROM accounts WHERE user_id IN (SELECT id FROM users WHERE email = " + "'" + recipient + "')";

	database.query(query1, { model: Account }).then(function(sender) {
		database.query(query2, { model: Account }).then(function(receiver) {
			sender.balance = sender.map(function(sender){ return sender.balance });
			sender.user_id = sender.map(function(sender){ return sender.user_id });
			receiver.balance = receiver.map(function(receiver){ return receiver.balance });
			receiver.user_id = receiver.map(function(receiver){ return receiver.user_id });

			sender.balance = parseInt(sender.balance, radix);
			receiver.balance = parseInt(receiver.balance, radix);
			sender.user_id = parseInt(sender.user_id, radix);
			receiver.user_id = parseInt(receiver.user_id, radix);

			if(sender.balance < amount) {
				req.flash('statusMessage', 'Insufficient balance');
				res.redirect('/profile');
			}

			if(receiver.user_id === null) {
				req.flash('statusMessage', 'Recipient not found');
				res.redirect('/profile');
			}

			if(sender.user_id === receiver.user_id) {
				req.flash('statusMessage', 'Transfer invalid');
				res.redirect('/profile');
			}
			
			database.transaction(function(t) {
				return Account.update( {
					balance: sender.balance - amount
				}, { where: { user_id: sender.user_id }
				}, { transaction: t }
				).then(function() {
					return Account.update( {
						balance: receiver.balance + amount
					}, { where: { user_id: receiver.user_id }
					}, { transaction: t });
				});
			}).then(function() {
				req.flash('statusMessage', 'Transferred ' + amount + ' to ' + recipient);
				res.redirect('/profile');
			});
		});
	});
});

app.post('/deposit', requireSignedIn, function(req, res) {
	const amount = parseInt(req.body.amount, radix);

	if(amount <= 0) {
		req.flash('statusMessage', 'Invalid amount');
		res.redirect('/profile');
	}

	console.log("DEPOSIT " + amount);

	User.findOne({ where: { email: req.user } }).then(function(user) {
		Account.findOne({ where: { user_id: user.id } }).then(function(userAccount) {
			if(userAccount !== null) {
				userAccount.update({
					balance: userAccount.balance + amount
				});
			}else {
				Account.create({
					balance: amount,
					user_id: user.id
				});
			}
		}).then(function() {
			req.flash('statusMessage', 'Deposited ' + amount);
			res.redirect('/profile');
		});
	});
});

app.post('/withdraw', requireSignedIn, function(req, res) {
	const amount = parseInt(req.body.amount, radix);

	if(amount <= 0) {
		req.flash('statusMessage', 'Invalid amount');
		res.redirect('/profile');
	}

	User.findOne({ where: { email: req.user } }).then(function(user) {
		Account.findOne({ where: { user_id: user.id } }).then(function(userAccount) {
			if(userAccount.balance >= amount || userAccount == null) {
				database.transaction(function(t) {
					return userAccount.update({
						balance: userAccount.balance - amount
					});
				}).then(function() {
					req.flash('statusMessage', 'Withdrawed ' + amount);
				});
			}else {
				req.flash('statusMessage', 'Insufficient balance');
			}
			res.redirect('/profile');
		});
	});
});

function requireSignedIn(req, res, next) {
    if (!req.session.currentUser) {
        return res.redirect('/');
    }
    next();
}

app.listen(3000, function() {
	console.log('Server is now running at port 3000');
});