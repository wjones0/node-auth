
var LocalStrategy = require('passport-local').Strategy;

var User = require('../app/models/user');



module.exports = function(passport) {

	// ---------  passport session setup ------------
	// required for persistent login sessions
	// passport needs to serialize and deserialize users out of session
	
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});
	
	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});


	//  LOCAL SIGNUP
	
	passport.use('local-signup', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, email, password, done) {
		
		// async
		// user.findOne won't fire unless data is sent back
		process.nextTick(function() {
			// find a user for the email address
			User.findOne({'local.email' : email}, function(err,user) {
				if(err)
					return done(err);
					
				if(user) {
					return done(null, false, req.flash('signupMessage', 'That email already exists.'));
				} else {
					// create the user
					var newUser = new User();
					
					newUser.local.email = email;
					newUser.local.password = newUser.generateHash(password);
					
					newUser.save(function(err) {
						if(err)
							throw err;
						return done(null, newUser);
					});
				}
			});
		});
	}
	));
	
	
	//  LOCAL LOGIN
	
	passport.use('local-login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, email, password, done) {
		User.findOne({'local.email' : email}, function(err, user) {
			if(err)
				return done(err);
			
			// no user found	
			if(!user)
				return done(null, false, req.flash('loginMessage', 'User not Found.'));
			
			if(!user.validPassword(password))
				return done(null, false, req.flash('loginMessage', 'Incorrect password!'));
			
			//  return the user as all is good.
			return done(null, user);
		});
	}
	));
	
};