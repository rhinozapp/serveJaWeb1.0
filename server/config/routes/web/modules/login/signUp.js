exports.signup = function (req, res) {
    let mongoose = require('mongoose'),
        userAdmin = mongoose.model('userAdmin'),
        userProfile = mongoose.model('userAdminProfile'),
        jwt = require('jsonwebtoken'),
        bcrypt = require('bcrypt'),
        salt = bcrypt.genSaltSync(10),
        token;

    new userAdmin({
        email: req.body.username,
        password : bcrypt.hashSync(req.body.password, salt)
    }).save().then(function (data) {
        new userProfile({
            userID : data._id,
            name: req.body.name,
            zipCode: req.body.zipCode,
            address : req.body.address ,
            number : req.body.number ,
            complement : req.body.complement ,
            neighborhood : req.body.neighborhood ,
            city : req.body.city ,
            uf : req.body.uf ,
            lat : req.body.lat ,
            long : req.body.long
        }).save().then(function (data) {
            token = jwt.sign({
                id : data.userID,
                email : req.body.username,
                name : req.body.name
            }, 'rhinoz', { expiresIn: '12h' });

            res.json({
                status : true,
                token : token
            });

        }, function (err) {
            console.log(err);
            res.json({status : false});
        });

    }, function (err) {
        console.log(err);
        res.json({status : false});

    });
};