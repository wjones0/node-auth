
var config = require('../config');

module.exports = {

	'facebookAuth' : {
		'clientID' : config.facebook.client_ID,
		'clientSecret' : config.facebook.client_secret,
		'callbackURL' : 'http://localhost:8080/auth/facebook/callback'
	},
	
	'twitterAuth' : {
		'consumerKey' : config.twitter.consumer_key,
		'consumerSecret' : config.twitter.consumer_secret,
		'callbackURL' : 'http://localhost:8080/auth/twitter/callback'
	},
	
	'googleAuth' : {
		'clientID' : config.google.client_ID,
		'clientSecret' : config.google.client_secret,
		'callbackURL' : 'http://localhost:8080/auth/google/callback'
	}
	
};