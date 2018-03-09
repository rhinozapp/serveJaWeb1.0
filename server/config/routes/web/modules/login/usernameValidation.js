exports.usernameValidation = function(req, res) {
    let mongoose = require('mongoose'),
        userAdmin = mongoose.model('userAdmin'),
        logger = require('../../../../logger');

    userAdmin.findOne({ email: req.body.username })
        .then(function(user) {
            logger.log("info", user);
            if (user) {
                logger.log("info", "Este usuário já existe");
                res.json({ status: false, message: "Esse usuário já existe. Você esqueceu sua senha?" })
            } else {
                res.json({ status: true })
            }
        }, function(err) {
            logger.log("error", err);
            res.json({ status: false, message: "Houve um erro em nossos servidores" })
        })
};