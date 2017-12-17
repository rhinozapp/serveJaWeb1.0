exports.getCategory = function (req, res) {
    let mongoose = require('mongoose'),
        category = mongoose.model('category');

    category.find({
        userID : req.body.id
    }, function(err, categoryList) {
        if (err){
            res.json({status : false});
        }else if(categoryList.length === 0) {
            res.json({status: false});
        }else{
            res.json({
                status: true,
                data : categoryList
            })
        }
    })
};