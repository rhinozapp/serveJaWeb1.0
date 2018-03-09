exports.checkRequestStatus = function (req, res) {
    let mongoose = require('mongoose'),
        requests = mongoose.model('requests');

    requests.findOne({
        $and: [{
            userAppID : mongoose.Types.ObjectId(req.body.userAppID),
            status : true
        }]
    }).populate('userID')
        .exec(function(err, requests) {
            if (err) {
                res.json({status: false});
            }else if(!requests){
                res.json({status: false});
            }else if(requests.length === 0) {
                res.json({status: false});
            }else{
                res.json({
                    status: true,
                    place : {
                        pubData : requests.userID
                    },
                    requestID : requests._id,
                    tableID : requests.tableID
                })
            }
        });
};