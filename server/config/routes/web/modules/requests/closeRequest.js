exports.closeRequest = function (req, res) {
    let mongoose = require('mongoose'),
        requests = mongoose.model('requests');

    requests.update({
        _id : mongoose.Types.ObjectId(req.body._id)
    }, {
        status : false
    }, {
        multi : false
    }, function (err) {
        if(err){
            console.log(err);
            res.json({
                status : false
            });
        }else{
            req.io.sockets.emit(req.body._id, {
                type : 'requestVerified',
                closeRequest : true
            });
            res.json({
                status : true
            });
        }
    });
};