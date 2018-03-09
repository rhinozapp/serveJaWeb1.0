exports.getProfile = function (req, res) {
    let mongoose = require('mongoose'),
        userAdmin = mongoose.model('userAdmin');

    userAdmin.find({
        _id : mongoose.Types.ObjectId(req.body.id)
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