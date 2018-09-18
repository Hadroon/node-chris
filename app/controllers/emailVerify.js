var User = require('../models/user');

async function verifyEmail(req, res) {
    var token = req.params.emailToken;
    let user;
    let userTwo;
    try {
        user = await User.updateOne({ 'local.emailVerificationToken': token }, { 'local.isEmailVerified': true });
        userTwo = await User.findOne({ 'local.emailVerificationToken': token });
        req.login(userTwo, function(err){
            if(err) return next(err);
            res.redirect('/');
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send();
    }
  }


  module.exports = verifyEmail;