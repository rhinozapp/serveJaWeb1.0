exports.saveProducts = function (req, res) {
    let mongoose = require('mongoose'),
        products = mongoose.model('products'),
        files = '',
        fileName = '';

    //region If file
    if(req.files.file){
        console.log(req.files);
        fileName = req.files.file.path.split('imgProducts/');
        files += fileName[1];

        products.update({
            _id : req.body.vars._id
        }, {
            imgPath : files
        },{
            multi : false
        }, function () {});
    }
    //endregion

    //region Treatment data
    if(req.body.vars.amount === 0 || req.body.vars.amount === 'null'){
        req.body.vars.amount = null;
    }

    if(req.body.vars.promotionValue === 0 || req.body.vars.promotionValue === 'null'){
        req.body.vars.promotionValue = null;
    }

    if(req.body.vars.value === 0 || req.body.vars.value === 'null'){
        req.body.vars.value = null;
    }

    if(req.body.vars.description === 'null'){
        req.body.vars.description = '';
    }
    //endregion

    if(req.body.vars._id){
        products.update({
            _id : req.body.vars._id
        }, {
            categoryID : req.body.vars.categoryID,
            productName: req.body.vars.productName,
            amount : Number(req.body.vars.amount),
            value : Number(req.body.vars.value),
            promotionValue : Number(req.body.vars.promotionValue),
            description: req.body.vars.description
        }, {
            multi : false
        }, function (err) {
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
            imgPath : files,
            description: req.body.vars.description
        }).save().then(function (data) {
            res.json({status : true});
        }, function (err) {
            console.log(err);
            res.json({status : false});
        });
    }
};