// -------------- setup ---------------------
// temporary config
var config = require('./config');

var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var configDB = require('./config/database.js');


//------------- configuration -------------
// connect to the db
mongoose.connect(configDB.url);


//require('./config/passport')(passport);


//--------- express setup ---------------
// log requests to the console
app.use(morgan('dev'));
// read cookies
app.use(cookieParser());
// get info from html forms
app.use(bodyParser());


//  setup ejs for templating
app.set('view engine','ejs');


// required for passport
// session secret
app.use(session({secret: config.session.secret}));
app.use(passport.initialize());

// persistent login sessions
app.use(passport.session());
// connect flash for flash messages stored in session
app.use(flash());


// -------------  routes ---------------------
// load routes and pass in app and configured passport
require('./app/routes.js')(app, passport);

// ------------- launch ------------------
app.listen(port);
console.log('Listening on port ' + port);
