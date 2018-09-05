var User = require('../models/user');


async function verifyEmail(req, res) {
    var token = req.params.emailToken;
    let user;
    let userTwo;
    console.log('token from verify func: ' + token);
    try {
        user = await User.updateOne({ 'local.emailVerificationToken': token }, { 'local.isEmailVerified': true });
        userTwo = await User.findOne({ 'local.emailVerificationToken': token });
        req.login(userTwo, function(err){
            if(err) return next(err);
            res.redirect('/profile');
        });
        console.log('user email from verify func: ');
        console.log(userTwo);
        // res.render('index.ejs');
    } catch (err) {
        //logger.error('Http error', err);
        console.log(err);
        return res.status(500).send();
    }
    console.log('ez a render után.')
  }


  module.exports = verifyEmail;