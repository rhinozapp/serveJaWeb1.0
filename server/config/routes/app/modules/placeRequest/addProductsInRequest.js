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
        multi : false
    }, function (err, data) {
        if(err){
            res.json({status : false});
        }else{
            console.log(data);
            req.io.sockets.emit(data.userID, data);

            res.json({status : true});
        }
    });
};