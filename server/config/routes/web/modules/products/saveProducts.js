exports.saveProducts = function (req, res) {
    let mongoose = require('mongoose'),
        products = mongoose.model('products'),
        files = '',
        fileName = '';

    //region If file
    if(req.files.file){
        fileName = req.files.file.path.split('imgProducts\\');
        files += fileName[1];

        products.update({
            _id : req.body.vars._id
        }, {
            imgPath : files
        },{
            multi : false
        });
    }
    //endregion

    if(req.body.vars._id){
        products.update({
            _id : req.body.vars._id
        }, {
            categoryID : req.body.vars.categoryID,
            productName: req.body.vars.productName,
            amount : req.body.vars.amount,
            value : req.body.vars.value,
            promotionValue : req.body.vars.promotionValue
        }, {
            multi : false
        }, function () {
            res.json({status : true});
        });
    }else{
        new products({
            userID: req.body.id,
            categoryID : req.body.vars.categoryID,
            productName: req.body.vars.productName,
            amount : req.body.vars.amount,
            value : req.body.vars.value,
            promotionValue : req.body.vars.promotionValue,
            imgPath : files
        }).save().then(function (data) {
            res.json({status : true});
        }, function (err) {
            console.log(err);
            res.json({status : false});
        });
    }
};