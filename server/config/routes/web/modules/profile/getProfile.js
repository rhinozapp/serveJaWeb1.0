exports.getProfile = function (req, res) {
    let mongoose = require('mongoose'),
        userProfile = mongoose.model('userAdminProfile');

    userProfile.find({
        userID : req.body.id
    }, function(err, user) {
        if (err){
            res.json({status : false});
        }else if(user.length === 0) {
            res.json({status: false});
        }else{
            res.json({
                status: true,
                data : user[0]
            })
        }
    })
};