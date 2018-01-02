exports.deleteProducts = function (req, res) {
    let mongoose = require('mongoose'),
        products = mongoose.model('products');

    products.remove({
        _id : req.body.id
    }, function (err) {
        if (err){
            res.json({status : false});
        }else{
            res.json({
                status: true
            })
        }
    })
};