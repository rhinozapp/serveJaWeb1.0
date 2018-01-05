exports.doLogin = function (req, res) {
    let mongoose = require('mongoose'),
        userApp = mongoose.model('userApp'),
        jwt = require('jsonwebtoken'),
        token;

    userApp.find({ idFace : req.body.data.id }, function(err, user) {
        if (err){
            res.json({status : false});
        }else if(user.length === 0) {
            new userApp({
                email: req.body.data.email,
                name : req.body.data.name,
                photo : req.body.data.picture.data.url,
                token : req.body.config.params.access_token,
                idFace : req.body.data.id
            }).save().then(function (data) {
                token = jwt.sign({
                    id : data._id,
                    email: data.email,
                    name : data.name,
                    photo : data.photo,
                    token : data.token,
                    idFace : data.idFace
                }, 'rhinoz');

                res.json({
                    token : token,
                    status : true
                });
            });
        }else{
            token = jwt.sign({
                email: req.body.data.email,
                name : req.body.data.name,
                photo : req.body.data.picture.data.url,
                token : req.body.config.params.access_token,
                idFace : req.body.data.id
            }, 'rhinoz');

            userApp.update({
                _id : user[0]._id
            }, {
                email: req.body.data.email,
                name : req.body.data.name,
                photo : req.body.data.picture.data.url,
                token : req.body.config.params.access_token,
                idFace : req.body.data.id
            }, {
                multi : false
            }, function () {
                res.json({
                    token : token,
                    status : true
                });
            });
        }
    });
};