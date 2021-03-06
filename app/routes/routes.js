// module.exports = function (app, passport) {

//     // =====================================
//     // HOME PAGE (with login links) ========
//     // =====================================
//     app.get('/', function (req, res) {

//         // res.render('index.ejs'); // load the index.ejs file

//         // console.log(req.user);

//         if (req.user) {
//             res.redirect('/profile')
//             // res.render('profile.ejs', {
//             //     user: req.user // get the user out of session and pass to template
//             // });
//         } else {
//             res.render('index.ejs', { message: req.flash('signupMessage') }); // load the index.ejs file
//         }
//     });

//     // =====================================
//     // LOGIN ===============================
//     // =====================================
//     // show the login form
//     app.get('/login', function (req, res) {

//         // render the page and pass in any flash data if it exists
//         res.render('login.ejs', { message: req.flash('loginMessage') });
//     });

//     // process the login form
//     app.post('/login', passport.authenticate('local-login', {
//         successRedirect: '/profile', // redirect to the secure profile section
//         failureRedirect: '/login', // redirect back to the signup page if there is an error
//         failureFlash: true // allow flash messages
//     }));

//     // =====================================
//     // SIGNUP ==============================
//     // =====================================
//     // show the signup form
//     app.get('/signup', function (req, res) {

//         // render the page and pass in any flash data if it exists
//         res.render('signup.ejs', { message: req.flash('signupMessage') });
//     });

//     // process the signup form
//     app.post('/signup', passport.authenticate('local-signup', {
//         // successRedirect: '/profile', // redirect to the secure profile section
//         successRedirect: '/verify', // redirect to the secure profile section
//         failureRedirect: '/signup', // redirect back to the signup page if there is an error
//         failureFlash: true // allow flash messages
//     }));

//     // Sending verification email.
//     app.get('/verify/:emailToken', function (req, res) {
//         var token = req.params.emailToken;
//         res.render('index.ejs', { message: '' });
//     });

//     // =====================================
//     // PROFILE SECTION =====================
//     // =====================================
//     // we will want this protected so you have to be logged in to visit
//     // we will use route middleware to verify this (the isLoggedIn function)
//     app.get('/profile', isLoggedIn, function (req, res) {
//         res.render('profile.ejs', {
//             user: req.user // get the user out of session and pass to template
//         });
//     });

//     // =====================================
//     // LOGOUT ==============================
//     // =====================================
//     app.get('/logout', function (req, res) {
//         req.logout();
//         res.redirect('/');
//     });

//     app.get('/v', isLoggedIn, function (req, res) {
//         res.render('valami.ejs', {
//             user: req.user
//         })
//     });

//     // =====================================
//     // GOOGLE ROUTES =======================
//     // =====================================
//     // send to google to do the authentication
//     // profile gets us their basic information including their name
//     // email gets their emails
//     app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

//     // the callback after google has authenticated the user
//     app.get('/auth/google/callback',
//         passport.authenticate('google', {
//             successRedirect: '/profile',
//             failureRedirect: '/'
//         }));

//     app.get('/forgot', function (req, res) {
//         res.render('forgot.ejs');
//     });

//     app.post('/forgot', function (req, res) {
//         console.log(req.body.email);
//         res.render('forgot.ejs');
//     });


// };

// // route middleware to make sure a user is logged in
// function isLoggedIn(req, res, next) {

//     // if user is authenticated in the session, carry on 
//     if (req.isAuthenticated())
//         return next();

//     // if they aren't redirect them to the home page
//     res.redirect('/');
// }
