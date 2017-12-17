exports.recoveryPasswordSend = function (req, res) {
    let mongoose = require('mongoose'),
        userModel = mongoose.model('userAdmin'),
        bcrypt = require('bcrypt'),
        salt = bcrypt.genSaltSync(10),
        passwordHash = bcrypt.hashSync(req.body.recoveryEmail, salt),
        sendEmail = require('../../app/helpers/emailSender');

    userModel.find({ email: req.body.recoveryEmail }, function(err, user) {
        if (err){
            res.json({status : false});
        }else if(user.length === 0) {
            res.json({status : false});
        }else{

            userModel.update({
                email : req.body.recoveryEmail
            }, {
                hashRecovery : passwordHash.replace('-', '')
            }, {
                multi : false
            }, function () {
                sendEmail.emailSend(
                    'rhinozapp@gmail.com',
                    req.body.recoveryEmail,
                    'Recuperação de senha',
                    'Recupere sua senha <a href="localhost/#/recoveryPassword/'+passwordHash.replace('-', '')+'">aqui</a>',
                    'Recupere sua senha <a href="localhost/#/recoveryPassword/'+passwordHash.replace('-', '')+'">aqui</a>');

                res.json({
                    status : true
                });
            });
        }
    });
};