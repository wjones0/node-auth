

module.exports = function(app, passport) {
	
	//  -----------  Index  /  ------------------
	app.get('/', function(req,res) {
		res.render('index.ejs');
	});
	
	
	//  ---------  Login   /login -------------------
	app.get('/login', function(req,res) {
		res.render('login.ejs', {message: req.flash('loginMessage') });
	});

	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/profile',
		failureRedirect: '/login',
		failureFlash: true
	}));
	
	
	
	// ------------ Sign up   /signup ---------------------
	app.get('/signup', function(req,res) {
		res.render('signup.ejs', {message: req.flash('signupMessage') });
	});
	
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile',
		failureRedirect : '/signup',
		failureFlash : true
	}));
	
	
	
	// ------------ Profile   /profile --------------------
	app.get('/profile', isLoggedIn, function(req,res) {
		res.render('profile.ejs', {
			user : req.user
		});
	});
	
	
	// -------------  FACEBOOK -----------------------------
	app.get('/auth/facebook', passport.authenticate('facebook', {scope : 'email'}));

	app.get('/auth/facebook/callback',
		passport.authenticate('facebook', {
			successRedirect : '/profile',
			failureRedirect : '/'
		}));	
	
	
	// ------------ Logout   /logout -----------------------
	app.get('/logout', function(req,res) {
		req.logout();
		res.redirect('/');
	});
	
	
	
	function isLoggedIn(req, res, next) {
		if(req.isAuthenticated())
			return next();
			
		res.redirect('/');
	}
	
};