exports.getListPubs = function (req, res) {
    let mongoose = require('mongoose'),
        userAdminProfile = mongoose.model('userAdminProfile');

    userAdminProfile.find({
        loc : {
            $nearSphere: [Number(req.body.long), Number(req.body.lat)],
            $maxDistance : 10000
        },
        statusLoc : true
    }).limit(100).exec(function(err, locations) {
        if (err) {
            res.json({
                status : false
            });
        }else{
            res.json({
                status : true,
                data : locations
            });
        }
    });

    /*userAdminProfile.aggregate(
        [
            {
                "$geoNear": {
                    "near": {
                        "type": "Point",
                        "coordinates": [req.body.long, req.body.lat]
                    },
                    "distanceField": "distance",
                    "maxDistance": 10000,
                    "spherical": true,
                }
            }
        ], function(err,results) {
            if(err){
                console.log(err)
            }else{
                console.log(results)
            }
        })*/
};