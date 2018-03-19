exports.saveProducts = function (req, res) {
    let mongoose = require('mongoose'),
        products = mongoose.model('products'),
        cloudinary = require('cloudinary'),
        files = '',
        fileName = '';

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

    //region update
    if(req.files.file){
        cloudinary.v2.uploader.upload(req.files.file.path, {
            folder : 'imgProducts'
        }, function (error, result) {
            products.update({
                _id : mongoose.Types.ObjectId(req.body.vars._id)
            }, {
                imgPath : result.secure_url,
                categoryID : req.body.vars.categoryID,
                productName: req.body.vars.productName,
                amount : Number(req.body.vars.amount),
                value : Number(req.body.vars.value),
                promotionValue : Number(req.body.vars.promotionValue),
                description: req.body.vars.description
            }, {
                multi : false,
                upsert: true
            }, function (err) {
                if(err){
                    res.json({status : false});
                }else{
                    res.json({status : true});
                }
            });
        });
    }else{
        products.update({
            _id : mongoose.Types.ObjectId(req.body.vars._id)
        }, {
            categoryID : req.body.vars.categoryID,
            productName: req.body.vars.productName,
            amount : Number(req.body.vars.amount),
            value : Number(req.body.vars.value),
            promotionValue : Number(req.body.vars.promotionValue),
            description: req.body.vars.description
        }, {
            multi : false,
            upsert: true
        }, function (err) {
            if(err){
                res.json({status : false});
            }else{
                res.json({status : true});
            }
        });
    }
    //endregion
};