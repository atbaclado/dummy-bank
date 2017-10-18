/* importing packages */
const express = require('express');
const bodyparser = require('body-parser');
const cookieparser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');
const consolidate = require('consolidate');

/* importing own packages (./) for start destination */
const database = require('./database');
const User = require('./models').User;
const Account = require('./models').Account;
const app = express();

/* used for string parsing */
const radix = 10;

/* syntax for importing and using static files */
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


/* transfering money to other account, needs two users for the transaction and the amount of money to transfer */
app.post('/transfer', requireSignedIn, function(req, res) {

	const recipient = req.body.recipient;
	const amount = parseInt(req.body.amount, radix);

	checkAmount(amount, req, res);

	var query1 = "SELECT user_id, balance FROM accounts WHERE user_id IN (SELECT id FROM users WHERE email=" +
    "'" + req.user + "')";
	var query2 = "SELECT user_id, balance FROM accounts WHERE user_id IN (SELECT id FROM users WHERE email=" +
    "'" + recipient + "')";

    /* sql injection */
	database.query(query1, { model: Account }).then(function(sender) {
		database.query(query2, { model: Account }).then(function(receiver) {
			sender.balance = sender.map(function(sender){ return sender.balance });
			sender.user_id = sender.map(function(sender){ return sender.user_id });
			receiver.balance = receiver.map(function(receiver){ return receiver.balance });
			receiver.user_id = receiver.map(function(receiver){ return receiver.user_id });

			if(!Array.isArray(receiver.user_id) || !receiver.user_id.length) {
				req.flash('statusMessage', 'Recipient not found');
			}

			sender.balance = parseInt(sender.balance, radix);
			receiver.balance = parseInt(receiver.balance, radix);
			sender.user_id = parseInt(sender.user_id, radix);
			receiver.user_id = parseInt(receiver.user_id, radix);

			if(sender.balance < amount) {
				req.flash('statusMessage', 'Insufficient balance');
			}

			if(sender.user_id === receiver.user_id) {
				req.flash('statusMessage', 'Transfer invalid');
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
			});

			res.redirect('/profile');
		});
	});

});

/* deposits amount to a certain account */
app.post('/deposit', requireSignedIn, function(req, res) {
    
	const amount = parseInt(req.body.amount, radix);
	
	checkAmount(amount, req, res);
	
	/* sql injection using different syntax, using the Models User and Account */
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


/* Transaction withdraw */
app.post('/withdraw', requireSignedIn, function(req, res) {

	const amount = parseInt(req.body.amount, radix);

	checkAmount(amount, req, res);
	
	/* sql injection using different syntax, using the Models User and Account */
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

function checkAmount(amount, req, res) {
	if(amount <= 0) {
		req.flash('statusMessage', 'Invalid amount');
		res.redirect('/profile');
	}
}

function requireSignedIn(req, res, next) {
  if (!req.session.currentUser) {
      return res.redirect('/');
  }
  /* next is needed for middleware functions */
  next();
}

app.listen(3000, function() {
	console.log('Server is now running at port 3000');
});