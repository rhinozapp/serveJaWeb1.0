exports.deleteCategory = function (req, res) {
    let mongoose = require('mongoose'),
        category = mongoose.model('category');

    category.remove({
        _id : req.body.categoryID
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