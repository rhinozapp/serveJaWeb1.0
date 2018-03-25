exports.doLogin = function (req, res) {
    let mongoose = require('mongoose'),
        userApp = mongoose.model('userApp'),
        jwt = require('jsonwebtoken'),
        token,
        data = {};

    if(req.body.type === 'facebook'){
        data.vars = {
            emailFace: req.body.data.email,
            name : req.body.data.name,
            photo : req.body.data.picture.data.url,
            tokenFace : null,
            idFace : req.body.data.id
        };

        data.vars.condition = {
            idFace : data.vars.idFace
        };
    }else{
        req.body.data = JSON.parse(req.body.data);

        data.vars = {
            emailGoogle: req.body.data.email,
            name : req.body.data.givenName,
            photo : req.body.data.imageUrl,
            tokenGoogle : req.body.data.accessToken,
            idGoogle : req.body.data.userId
        };

        data.vars.condition = {
            idGoogle : data.vars.idGoogle
        };
    }

    userApp.findOneAndUpdate(data.vars.condition, data.vars, {
        multi : false,
        upsert: true,
        new : true
    }, function(err, user) {
        if(err) {
            console.log(err);
            res.json({
                status: false
            });
        }else if(!user){
            res.json({
                status: false
            });
        }else{
            token = jwt.sign({
                id : user._id,
                emailFace: user.emailFace,
                emailGoogle: user.emailGoogle,
                name : user.name,
                photo : user.photo,
                tokenFace : user.tokenFace,
                tokenGoogle : user.tokenGoogle,
                idFace : user.idFace,
                idGoogle : user.idGoogle
            }, 'rhinoz');

            res.json({
                token : token,
                status : true
            });
        }
    });
};