var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var path = require('path');
//--
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
const MongoStore = require('connect-mongo')(session);

var config = require('./config/config.js');


// mongoose.connect(configDB.url); // connect to our database
mongoose.connect(config.all.mongoUri); // connect to our database

//--
mongoose.Promise = global.Promise;
const db = mongoose.connection

require('./config/passport.js')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs'); // set up ejs for templating
app.set('views', path.join(__dirname, '/app/views')); // set up ejs for templating

// required for passport
// app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(session({
    secret: config.all.sessionSecret,
    saveUninitialized: true,
    resave: false,
    store   : new MongoStore({ mongooseConnection: db })
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

require('./routes/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

module.exports = app;
