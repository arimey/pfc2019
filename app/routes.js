
var User = require('./models/users');


module.exports = function(app, passport) {

	app.get('/', function(req, res) {
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
			console.log(user);
			if (user[0].userType === "Admin") {
				console.log(user);
				res.render('adminRoom.html', {user: user[0].username});
			}
			else {
				Subject.populate(user, {path: "subjects"}, (err, user) => {
					userJSON = user;
					console.log(user[0].subjects);
					res.render('indexRooms.html', {user: userJSON[0].username, userJSON: JSON.stringify(userJSON[0].subjects), permission: JSON.stringify(userJSON[0].userType)});
				});
			}
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
		if (req.params.id === 'Panel Administración') {
			res.render('adminRoom.html', {user: req.user.username});
		} else {
				res.render('indexMediasoup.html', { user: req.user.username, room: req.params.id, permission: req.user.userType });
		}
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

}

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/');
}

function updateRoomNumberConnections(roomName) {
	var Subject = require('./models/subjects');
	Subject.find({name: roomName}, (err, subjectItem) => {
		if (err) throw err;
		var connections = subjectItem[0].connections + 1;
		Subject.findOneAndUpdate({name: roomName}, {
				"$set": {
						"connections": connections,
				}
		}).exec((err, user) => {
			if (err) {
					console.log(err);
					return;
			}
		});
	});

}
