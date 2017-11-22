exports.doLogin = function (req, res) {
    let mongoose = require('mongoose'),
        userModel = mongoose.model('userAdmin'),
        userProfile = mongoose.model('userAdminProfile'),
        bcrypt = require('bcrypt'),
        jwt = require('jsonwebtoken'),
        token;

    userModel.find({ email: req.body.username }, function(err, user) {
        if (err){
            res.json({status : false});
        }else if(user.length === 0) {
            res.json({status : false});
        }else{
            bcrypt.compare(req.body.password, user[0].password, function(err, isMatch) {
                if (err){
                    res.json({status : isMatch});
                }else{
                    userProfile.find({userID : user[0]._id}, function (err, userProfile) {
                        if (err){
                            res.json({status : false});
                        }else if(userProfile.length > 0) {
                            token = jwt.sign({
                                id : user[0]._id,
                                email : user[0].email,
                                name : userProfile[0].name
                            }, 'rhinoz', { expiresIn: '12h' });

                            res.json({
                                status : isMatch,
                                token : token
                            });
                        }else{
                            res.json({status : false});
                        }
                    });
                }
            });
        }
    });
};