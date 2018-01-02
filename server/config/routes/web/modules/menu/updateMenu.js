exports.updateMenu = function (req, res) {
    let mongoose = require('mongoose'),
        menu = mongoose.model('menu'),
        dataToSave = [];

    //region Treatment to save
    if(req.body.data){
        req.body.data.forEach(function (value) {
            if(value.view){
                value.products.forEach(function (valueProd) {
                    if(valueProd.statusInMenu){
                        dataToSave.push({
                            productID : valueProd.productID
                        });
                    }
                });
            }
        });
    }
    //endregion

    if(req.body.menuID){
        menu.update({
            _id : req.body.menuID
        }, {
            menuName : req.body.name,
            productsID : dataToSave
        }, {
            multi : false
        }, function () {
            res.json({status : true});
        });
    }else{
        new menu({
            userID: req.body.id,
            menuName : req.body.name,
            productsID : dataToSave
        }).save().then(function (data) {
            res.json({status : true});
        }, function (err) {
            console.log(err);
            res.json({status : false});
        });
    }
};