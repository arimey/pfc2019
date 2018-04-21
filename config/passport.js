var LocalStrategy = require('passport-local').Strategy;

var User = require('../app/models/users');

module.exports = function(passport) {

	passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

	// used to deserialize the user
	passport.deserializeUser(function(id, done) {
	    User.findById(id, function(err, user) {
	        done(err, user);
	    });
	});

	passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'pass',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, pass, done) {

        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'email' :  email }, function(err, user) {
            // if there are any errors, return the error
            if (err) {
            	console.log(err);
                return done(err);
            }

            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, req.flash('signupMessage', 'El correo ya está en uso.'));
            } else {

                // if there is no user with that email
                // create the user
                var newUser            = new User();

                // set the user's local credentials
                newUser.email    = req.body.email;
                newUser.password = req.body.pass;
                newUser.username = req.body.user;
                newUser.passwordConf = req.body.passConf;

                // save the user
                newUser.save(function(err) {
                    if (err)
                        throw console.log(err);
                    return done(null, newUser);
                });
            }

        });    

        });

    }));


    passport.use('local-login', new LocalStrategy({
    	usernameField : 'email',
    	passwordField : 'pass',
    	passReqToCallback : true
    },
    function(req, email, password, done) {
    	User.findOne({ 'email' : email }, function(err, user) {
    		if (err)
    			return done(err);

    		if (!user)
    			return done(null, false, req.flash('loginMessage', 'Usuario no encontrado.'));

    		if (user.password != req.body.pass)
    			return done(null, false, req.flash('loginMessage', 'Ooops! Contraseña incorrecta'));

    		return done(null, user);
    	});
    }));

}
