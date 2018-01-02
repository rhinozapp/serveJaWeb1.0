exports.getTables = function (req, res) {
    let mongoose = require('mongoose'),
        tables = mongoose.model('tables');

    tables.find({
        userID : req.body.id
    }, function(err, tablesList) {
        if (err){
            res.json({status : false});
        }else if(tablesList.length === 0) {
            res.json({status: false});
        }else{
            res.json({
                status: true,
                data : tablesList
            })
        }
    })
};