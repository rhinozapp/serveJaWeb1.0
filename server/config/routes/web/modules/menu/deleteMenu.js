exports.deleteMenu = function (req, res) {
    let mongoose = require('mongoose'),
        menu = mongoose.model('menu');

    menu.remove({
        _id : req.body.menuID
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