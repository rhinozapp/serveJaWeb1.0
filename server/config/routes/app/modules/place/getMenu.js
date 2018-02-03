exports.getMenu = function (req, res) {
    let mongoose = require('mongoose'),
        menu = mongoose.model('menu');

    menu.findOne({
        _id : req.body.menuDefined
    }).populate('productsID')
        .exec(function(err, menuList) {
            if (err) {
                res.json({status: false});
            }else if(!menuList){
                res.json({status: false});
            }else if(menuList.length === 0) {
                res.json({status: false});
            }else{
                res.json({
                    status: true,
                    data : menuList
                })
            }
        });
};