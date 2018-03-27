exports.deleteTables = function (req, res) {
    let mongoose = require('mongoose'),
        tables = mongoose.model('tables');

    tables.remove({
        _id : mongoose.Types.ObjectId(req.body.tablesID)
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