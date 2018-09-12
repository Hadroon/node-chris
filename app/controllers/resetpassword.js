var RandomString = require('randomstring');
var nodemailer = require('nodemailer');

var User = require('../models/user');
var Config = require('../../config/config');

exports.get_reset = async function (req, res) {
  let token = req.params.token;
  try {
    let user = await User.findOne({ 'local.resetPasswordToken': token });
    if (user) {
      return res.render('resetpassword.ejs', { token: token, message: '' });
    }

  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
  // res.render('resetpassword.ejs');
};

exports.post_reset = async function (req, res) {

  var password = req.body.password;
  var passwordTwo = req.body.passwordtwo;
  let token = req.params.token;

  if(password !== passwordTwo) {
    return res.render('resetpassword.ejs', { message: 'A megadott jelszavak nem egyeznek.', token: token });
  }

  let user;

  try {
    user = await User.findOne({ 'local.resetPasswordToken': token });

    if (token == user.local.resetPasswordToken) {

      user.local.password = user.generateHash(password);
      user.local.resetPasswordToken = '';

      user.save(function (err) {
        if (err)
          throw err;
      });
      
      req.login(user, function (err) {
        if (err) return next(err);
        res.redirect('/profile');
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }

  res.render('index.ejs');
};
