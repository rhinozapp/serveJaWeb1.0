exports.getRequestsStop = function (req, res) {
    let mongoose = require('mongoose'),
        requests = mongoose.model('requests');

    requests.find({
        $and : [
            {
                userID : req.body.id,
                requireStop : true,
                status : true
            }
        ]

    })
        .populate('tableID')
        .populate('products.productID')
        .populate('userAppID')
        .exec(function (err, data) {
            if(err){
                res.json({
                    status : false
                });
            }else{
                res.json({
                    status : true,
                    requests : data
                });
            }
        });
};