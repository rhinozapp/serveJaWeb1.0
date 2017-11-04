exports.doLogin = function (req, res) {
    let mongoose = require('mongoose'),
        userModel = mongoose.model('userAdmin'),
        bcrypt = require('bcrypt'),
        salt = bcrypt.genSaltSync(10);

    userModel.find({ email: req.body.username }, function(err, user) {
        console.log(user);
        if (err){
            res.json({
                status : false
            });
        }else if(user.length === 0) {
            res.json({
                status : false
            });
        }else{
            bcrypt.compare(req.body.password, user[0].password, function(err, isMatch) {
                if (err){
                    res.json({
                        status : isMatch
                    });
                }else{
                    //TODO build token with JWT
                    res.json({
                        status : isMatch
                    });
                }
            });
        }
    });
};