
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;

var User = require('../app/models/user');

var configAuth = require('./auth');


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

	//----------------------------LOCAL-----------------------
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
	
	
	//---------------------FACEBOOK---------------------------
	
	passport.use(new FacebookStrategy({
		clientID : configAuth.facebookAuth.clientID,
		clientSecret : configAuth.facebookAuth.clientSecret,
		callbackURL : configAuth.facebookAuth.callbackURL
	},
	
	//  facebook will send back the token and profile
	function(token, refreshToken, profile, done) {
		
		// async
		process.nextTick(function() {
			
			// find the user
			User.findOne({ 'facebook.id' : profile.id}, function(err,user) {
				if(err)
					return done(err);
				
				if(user) {
					return done(null, user);
				} else {
					var newUser = new User();
					
					newUser.facebook.id = profile.id;
					newUser.facebook.token = token;
					newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
					newUser.facebook.email = profile.emails[0].value;
					
					newUser.save(function(err) {
						if(err)
							throw err;
						
						return done(null,newUser);
					});
				}

			});
		});
	}
	
	));
	
	
	// --------------------- TWITTER ------------------------
	
	passport.use(new TwitterStrategy({
		consumerKey : configAuth.twitterAuth.consumerKey,
		consumerSecret : configAuth.twitterAuth.consumerSecret,
		callbackURL : configAuth.twitterAuth.callbackURL
	},
	function(token, tokenSecet, profile, done) {
		process.nextTick(function() {
			User.findOne({ 'twitter.id' : profile.id}, function(err, user) {
				if(err)
					return done(err);
				
				if(user) {
					return done(null,user);
				} else {
					var newUser = new User();
					
					newUser.twitter.id = profile.id;
					newUser.twitter.token = token;
					newUser.twitter.username = profile.username;
					newUser.twitter.displayName = profile.displayName;
					
					newUser.save(function(err) {
						if(err)
							throw err;
						return done(null,newUser);
					});
				}
			});
		});
	}
	));
	
};