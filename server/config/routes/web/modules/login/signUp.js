exports.signup = function(req, res) {
    let mongoose = require('mongoose'),
        userAdmin = mongoose.model('userAdmin'),
        jwt = require('jsonwebtoken'),
        bcrypt = require('bcrypt'),
        salt = bcrypt.genSaltSync(10),
        logger = require('../../../../logger'),
        token;

    new userAdmin({
        email: req.body.username,
        password: bcrypt.hashSync(req.body.password, salt),
        name: req.body.name,
        cnpj: req.body.cnpj,
        zipCode: req.body.zipCode,
        address: req.body.address,
        number: req.body.number,
        complement: req.body.complement,
        neighborhood: req.body.neighborhood,
        city: req.body.city,
        uf: req.body.uf,
        loc: {
            'type': 'Point',
            coordinates: [req.body.long, req.body.lat]
        },
        statusLoc: req.body.status
    }).save().then(function(user) {
        token = jwt.sign({
            id: user._id,
            email: user.username,
            name: user.name,
            logoPath: user.logoPath
        }, 'rhinoz', { expiresIn: '12h' });

        res.json({
            status: true,
            token: token
        });

    }, function(err) {
        logger.log('error', err);
        res.json({
            status: false,
            message: 'Houve um erro ao cadastrar este e-mail e senha. Tem certeza que você já não é nosso cliente? :)'
        });
    });
};