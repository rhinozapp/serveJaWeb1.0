exports.doLogin = function (req, res) {
    let mongoose = require('mongoose'),
        userApp = mongoose.model('userApp'),
        jwt = require('jsonwebtoken'),
        token,
        data = {};

    if(req.body.data){
        data.vars = {
            emailFace: req.body.data.email,
            name : req.body.data.name,
            photo : req.body.data.picture.data.url,
            tokenFace : req.body.config.params.access_token,
            idFace : req.body.data.id
        }
    }else{
        data.vars = {
            emailGoogle: req.body.email,
            name : req.body.givenName,
            photo : req.body.imageUrl,
            tokenGoogle : req.body.accessToken,
            idGoogle : req.body.userId
        }
    }

    userApp.update({
        $or : [
            {idFace : data.vars.idFace},
            {idGoogle : data.vars.idGoogle}
        ]
    }, data.vars, {
        multi : false,
        upsert: true
    }, function(err, status) {
        if(!err){
            userApp.find({
                $or : [
                    {idFace : data.vars.idFace},
                    {idGoogle : data.vars.idGoogle}
                ]
            }, function(err, user) {
                token = jwt.sign({
                    id : user[0]._id,
                    emailFace: user[0].emailFace,
                    emailGoogle: user[0].emailGoogle,
                    name : user[0].name,
                    photo : user[0].photo,
                    tokenFace : user[0].tokenFace,
                    tokenGoogle : user[0].tokenGoogle,
                    idFace : user[0].idFace,
                    idGoogle : user[0].idGoogle
                }, 'rhinoz');

                res.json({
                    token : token,
                    status : true
                });
            });
        }else{
            res.json({
                status : false
            });
        }
    });

    /*userApp.find({ idFace : req.body.data.id }, function(err, user) {
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
            console.log(user[0]._id);

            token = jwt.sign({
                id : user[0]._id,
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
    });*/

};