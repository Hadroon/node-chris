// config/passport.js

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var RandomString = require('randomstring');
var nodemailer = require('nodemailer');

// load up the user model
var User = require('../models/user');

// load the auth variables
// var configAuth = require('./auth');
var config = require('../../config/config');
var configAuth = config.all;


// expose this function to our app using module.exports
module.exports = function (passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
        function (req, email, password, done) {

            var regexPatt = new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");
            var isValidEmail = regexPatt.test(email);
            if (!isValidEmail) {
                return done(null, false, req.flash('signupMessage', 'Kérlek ellenőrizd a megadott email címet.'));
            }

            if (password.length < 6) {
                return done(null, false, req.flash('signupMessage', 'A jelszónak legalább 6 karakter hosszúnak kell lennie.'));
            }

            if (password !== req.body.passwordtwo) {
                return done(null, false, req.flash('signupMessage', 'A jelszavaknak meg kell egyeznie.'));
            }

            if (req.body.eula != 1 || req.body.gdpr != 1) {
                return done(null, false, req.flash('signupMessage', 'Az oldal használatához a szabályzatot és'
                    + 'az adatvédelmi szabályzatot is el kell fogadni.'));
            }


            // asynchronous
            // User.findOne wont fire unless data is sent back
            process.nextTick(function () {

                // find a user whose email is the same as the forms email
                // we are checking to see if the user trying to login already exists
                // User.findOne({ 'local.email': email }, function (err, user) {
                User.findOne({ $or: [{ 'local.email': email }, { 'google.email': email }] }, function (err, user) {
                    // if there are any errors, return the error
                    if (err)
                        return done(err);

                    // check to see if theres already a user with that email
                    if (user) {

                        if (user.local.isEmailVerified === false) {
                            return done(null, false, req.flash('signupMessage', 'Email címedre aktíváló emailt küldtünk. Kérünk aktíváld az email címedet'));
                        }

                        // if already registered with google, just updating the user
                        if (user.google.email == email) {
                            //var newUser = new User();

                            // set the user's local credentials
                            user.local.email = email;
                            user.local.password = user.generateHash(password);

                            // save the user
                            user.save(function (err) {
                                if (err)
                                    throw err;
                                return done(null, user);
                            });
                        } else {
                            return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                        }
                    } else {

                        // if there is no user with that email
                        // create the user
                        var newUser = new User();

                        // set the user's local credentials
                        newUser.local.email = email;
                        newUser.local.password = newUser.generateHash(password);
                        newUser.local.isEmailVerified = false;
                        newUser.local.emailVerificationToken = RandomString.generate({
                            length: 64
                        });
                        var date = new Date();
                        date.setHours(date.getHours() + 2);
                        newUser.local.registered = date;
                        newUser.local.eula = true;
                        newUser.local.gdpr = true;
                        newUser.name = req.body.name;
                        

                        // save the user
                        newUser.save(function (err) {
                            if (err)
                                throw err;
                            // return done(null, newUser);
                            return done(null, false, req.flash('signupMessage', 'Email címedre aktíváló levelet küldtünk.'));
                        });

                        var transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: 'gabor.muranyi@gmail.com',
                                pass: config.all.gpass
                            }
                        });

                        var mailOptions = {
                            from: 'noreply@wangaru-interactive.com',
                            to: email,
                            subject: 'Aktíváló email',
                            html: '<a href="http://' + req.headers.host + '/verify/' + newUser.local.emailVerificationToken + '" class="btn btn-default">Akíváláshoz kérlek kattints ide.</a>'
                        };

                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log('Email sent: ' + info.response);
                            }
                        });



                    }

                });

            });

        }));


    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
        function (req, email, password, done) { // callback with email and password from our form

            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            User.findOne({ 'local.email': email }, function (err, user) {
                // if there are any errors, return the error before anything else
                if (err)
                    return done(err);

                // if no user is found, return the message
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'Nem megfelelő email/jelszó.')); // req.flash is the way to set flashdata using connect-flash

                if (!user.local.isEmailVerified)
                    return done(null, false, req.flash('loginMessage', 'Kérklek aktíváld az email címedet.')); // req.flash is the way to set flashdata using connect-flash

                // if the user is found but the password is wrong
                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Nem megfelelő email/jelszó.')); // create the loginMessage and save it to session as flashdata

                // all is well, return successful user
                return done(null, user);
            });

        }));


    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================

    passport.use(new GoogleStrategy({

        clientID: configAuth.googleAuth.clientID,
        clientSecret: configAuth.googleAuth.clientSecret,
        callbackURL: configAuth.googleAuth.callbackURL,
        passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

    },
        function (req, token, refreshToken, profile, done) {

            // asynchronous
            process.nextTick(function () {

                // check if the user is already logged in
                if (!req.user) {

                    User.findOne({ $or: [{ 'google.id': profile.id }, { 'local.email': profile.emails[0].value }] }, function (err, user) {
                        if (err)
                            return done(err);

                        if (user) {

                            // if there is a user id already but no token (user was linked at one point and then removed)
                            if (!user.google.token) {
                                user.google.token = token;
                                user.google.name = profile.displayName;
                                if (!user.name) user.name = profile.displayName;
                                user.google.email = profile.emails[0].value; // pull the first email
                                let date = new Date();
                                date.setHours(date.getHours() + 2);
                                user.local.registered = date;

                                user.save(function (err) {
                                    if (err)
                                        throw err;
                                    return done(null, user);
                                });
                            }

                            return done(null, user);
                        } else {
                            var newUser = new User();

                            newUser.google.id = profile.id;
                            newUser.google.token = token;
                            newUser.google.name = profile.displayName;
                            newUser.name = profile.displayName;
                            newUser.google.email = profile.emails[0].value; // pull the first email

                            newUser.save(function (err) {
                                if (err)
                                    throw err;
                                return done(null, newUser);
                            });
                        }
                    });

                } else {
                    // user already exists and is logged in, we have to link accounts
                    var user = req.user; // pull the user out of the session

                    user.google.id = profile.id;
                    user.google.token = token;
                    user.google.name = profile.displayName;
                    if (!user.name) user.name = profile.displayName;
                    user.google.email = profile.emails[0].value; // pull the first email

                    user.save(function (err) {
                        if (err)
                            throw err;
                        return done(null, user);
                    });

                }

            });

        }));

};