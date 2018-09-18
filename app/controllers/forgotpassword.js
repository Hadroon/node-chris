var RandomString = require('randomstring');
var nodemailer = require('nodemailer');

var User = require('../models/user');
var Config = require('../../config/config');

exports.get_forgot = function (req, res) {
    res.render('forgot.ejs', {message: ''});
};

exports.post_forgot = async function (req, res) {
    var email = req.body.email;
    let user;
    try {
        user = await User.findOne({ 'local.email': email });
        user.local.resetPasswordToken = RandomString.generate({
            length: 64
        });
        user.save(function (err) {
            if (err)
                throw err;
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send();
    }

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'gabor.muranyi@gmail.com',
            pass: Config.all.gpass
        }
    });

    var mailOptions = {
        from: 'gabor.muranyi@gmail.com',
        to: user.local.email,
        subject: 'Jelszó törlése',
        html: '<a href="http://' + req.headers.host + '/reset-password/' + user.local.resetPasswordToken + '" class="btn btn-default">Akíváláshoz kérlek kattints ide.</a>'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    res.render('forgot.ejs');
};
