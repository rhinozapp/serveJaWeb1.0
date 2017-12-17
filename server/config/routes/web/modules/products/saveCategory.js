exports.saveCategory = function (req, res) {
    let mongoose = require('mongoose'),
        category = mongoose.model('category');

    if(req.body.data.categoryID){
        category.update({
            _id : req.body.data.categoryID
        }, {
            categoryName : req.body.data.categoryName
        }, {
            multi : false
        }, function () {
            res.json({status : true});
        });
    }else{
        new category({
            userID: req.body.id,
            categoryName : req.body.data.categoryName
        }).save().then(function (data) {
            res.json({status : true});
        }, function (err) {
            console.log(err);
            res.json({status : false});
        });
    }
};