exports.requireClose = function (req, res) {
    let mongoose = require('mongoose'),
        requests = mongoose.model('requests');

    requests.findOneAndUpdate({
        _id: mongoose.Types.ObjectId(req.body.requestID)
    }, {
        requireStop : true
    }, {
        multi : false,
        new: true
    })
        .populate('tableID')
        .populate('products.productID')
        .exec(function (err, data) {
            if(err){
                res.json({status : false});
            }else{
                req.io.sockets.emit(data.userID, {
                    type : 'requireStop',
                    data : data
                });
                res.json({
                    status : true,
                    data : data
                });
            }
        });
};