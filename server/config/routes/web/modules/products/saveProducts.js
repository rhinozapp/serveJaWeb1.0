exports.saveProducts = function (req, res) {
    let mongoose = require('mongoose'),
        products = mongoose.model('products');

    if(req.body.data._id){
        products.update({
            _id : req.body.data._id
        }, {
            categoryID : req.body.data.categoryID,
            productName: req.body.data.productName,
            amount : req.body.data.amount,
            value : req.body.data.value,
            promotionValue : req.body.data.promotionValue
        }, {
            multi : false
        }, function () {
            res.json({status : true});
        });
    }else{
        new products({
            userID: req.body.id,
            categoryID : req.body.data.categoryID,
            productName: req.body.data.productName,
            amount : req.body.data.amount,
            value : req.body.data.value,
            promotionValue : req.body.data.promotionValue
        }).save().then(function (data) {
            res.json({status : true});
        }, function (err) {
            console.log(err);
            res.json({status : false});
        });
    }
};