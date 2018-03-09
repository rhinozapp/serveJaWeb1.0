exports.startRequest = function (req, res) {
    let mongoose = require('mongoose'),
        requests = mongoose.model('requests');

    new requests({
        userID: req.body.place.pubData._id,
        userAppID : req.body.userAppID,
        tableID : req.body.tableID,
        status : true
    }).save().then(function (data) {
        res.json({status : true});
    }, function (err) {
        console.log(err);
        res.json({status : false});
    });
};