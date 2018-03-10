exports.checkProductSent = function (req, res) {
    let mongoose = require('mongoose'),
        requests = mongoose.model('requests');

    requests.update({
        'products._id' : mongoose.Types.ObjectId(req.body.idRequest)
    }, {
        $set : {
            'products.$.status' : true
        }
    }, {
        multi : false
    }, function (err) {
        if(err){
            console.log(err);
            res.json({
                status : false
            });
        }else{
            res.json({
                status : true
            });
        }
    });
};