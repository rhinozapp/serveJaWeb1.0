exports.recoveryPassword = function (req, res) {
    let mongoose = require('mongoose'),
        userModel = mongoose.model('userAdmin'),
        bcrypt = require('bcrypt'),
        salt = bcrypt.genSaltSync(10);

    userModel.update({
        hashRecovery : req.body.hashRecovery
    }, {
        password : bcrypt.hashSync(req.body.password, salt),
        hashRecovery : null
    }, {
        multi : false
    }, function () {
        res.json({
            status : true
        });
    });
};