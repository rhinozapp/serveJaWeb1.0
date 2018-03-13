exports.addProductsInRequest = function (req, res) {
    let mongoose = require('mongoose'),
        requests = mongoose.model('requests');

    requests.findOneAndUpdate({
        _id: mongoose.Types.ObjectId(req.body.requestID)
    }, {
        $pushAll : {
            products : req.body.products
        }
    }, {
        multi : false,
        new: true
    })
        .populate('tableID')
        .populate('products.productID')
        .populate('userAppID')
        .exec(function (err, data) {
            if(err){
                res.json({status : false});
            }else{
                req.io.sockets.emit(data.userID, {
                    type : 'newProductInRequest',
                    data : data
                });
                res.json({status : true});
            }
        });
};