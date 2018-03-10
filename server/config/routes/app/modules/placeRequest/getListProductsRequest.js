exports.getListProductsRequest = function (req, res) {
    let mongoose = require('mongoose'),
        requests = mongoose.model('requests');

    requests.findOne({
        _id: mongoose.Types.ObjectId(req.body.requestID)
    })
        .populate('tableID')
        .populate('products.productID')
        .exec(function (err, data) {
            if(err){
                res.json({status : false});
            }else{
                res.json({
                    status : true,
                    data : data
                });
            }
        });
};