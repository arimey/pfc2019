
var User = require('./models/users');


module.exports = function(app, passport) {

	app.get('/', function(req, res) {
	  // try to initialize the db on every request if it's not already
	  // initialized.
	  res.render('identificacion.html', { message: req.flash('loginMessage') });

	});

	app.post('/', passport.authenticate('local-login', {
		successRedirect : '/rooms',
		failureRedirect : '/',
		failuerFlash: true
	}));

	app.get('/registro', function(req, res) {
		res.render('registro.html', { message: req.flash('signupMessage') });
	});

	app.post('/registro', passport.authenticate('local-signup', {
			successRedirect : '/rooms',
			failureRedirect : '/registro',
			failureFlash : true
	}));

	app.get('/rooms', isLoggedIn, function(req, res) {
		var userJSON;
		var Subject = require('./models/subjects');
		User.find({ username: req.user.username }, (err, user) => {
			if (err) throw err;
			Subject.populate(user, {path: "subjects"}, (err, user) => {
				userJSON = user;
				console.log(user[0].subjects);
				res.render('indexRooms.html', {user: userJSON[0].username, userJSON: JSON.stringify(userJSON[0].subjects), permission: JSON.stringify(userJSON[0].userType)});
			});
		});
	});

	app.get('/index2', isLoggedIn, function(req, res) {
		var userJSON;
		var Subject = require('./models/subjects');
		User.find({ username: req.user.username }, (err, user) => {
			if (err) throw err;
			Subject.populate(user, {path: "subjects"}, (err, user) => {
				userJSON = user;
				console.log(user[0].subjects);
				res.render('indexMediasoup.html', {user: userJSON[0].username, userJSON: JSON.stringify(userJSON[0].subjects), permission: JSON.stringify(userJSON[0].userType)});
			});
		});
	});

	app.get('/sala/:id', function(req, res) {
		res.render('indexMediasoup.html', { user: req.user.username, room: req.params.id, permission: req.user.userType });
	});

	app.get('/index', isLoggedIn, function(req, res) {
		var userJSON;
		var Subject = require('./models/subjects');
		User.find({ username: req.user.username }, (err, user) => {
			if (err) throw err;
			Subject.populate(user, {path: "subjects"}, (err, user) => {
				userJSON = user;
				res.render('indexRooms.html', {user: userJSON[0].username, userJSON: JSON.stringify(userJSON[0].subjects), permission: JSON.stringify(userJSON[0].userType)});
			});
		});

	});

	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	})


	app.use(function(req, res, next) {
		var err = new Error('File Not Found');
		err.status = 404;
		next(err);
	});

}

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/');
}
