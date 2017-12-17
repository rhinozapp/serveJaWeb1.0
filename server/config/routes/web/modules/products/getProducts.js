exports.getProducts = function (req, res) {
    let mongoose = require('mongoose'),
        products = mongoose.model('products');

    products.find({
        userID : req.body.id
    }, function(err, productsList) {
        if (err){
            res.json({status : false});
        }else if(productsList.length === 0) {
            res.json({status: false});
        }else{
            res.json({
                status: true,
                data : productsList
            })
        }
    })
};