exports.getListPubs = function (req, res) {
    let mongoose = require('mongoose'),
        userAdminProfile = mongoose.model('userAdminProfile');

    userAdminProfile.find({
        loc : {
            $nearSphere: {
                $geometry: {
                    type : 'Point',
                    coordinates : [Number(req.body.long), Number(req.body.lat)]
                },
                $maxDistance: 15 * 1000
            }
        }
    }).limit(100).exec(function(err, locations) {
        if (err) {
            res.json({
                data : err,
                status : false
            });
        }else{
            res.json({
                status : true,
                data : locations
            });
        }
    });
};