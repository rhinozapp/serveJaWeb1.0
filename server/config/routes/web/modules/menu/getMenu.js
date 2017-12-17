exports.getMenu = function (req, res) {
    let mongoose = require('mongoose'),
        menu = mongoose.model('menu');

    menu.find({
        userID : req.body.id
    }, function(err, menuList) {
        if (err){
            res.json({status : false});
        }else if(menuList.length === 0) {
            res.json({status: false});
        }else{
            res.json({
                status: true,
                data : menuList
            })
        }
    })
};