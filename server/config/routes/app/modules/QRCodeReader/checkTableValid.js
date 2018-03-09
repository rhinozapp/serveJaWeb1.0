exports.checkTableValid = function (req, res) {
    let mongoose = require('mongoose'),
        tables = mongoose.model('tables');

    tables.find({
        $and: [{
            '_id' : mongoose.Types.ObjectId(req.body.tableID),
            userID : mongoose.Types.ObjectId(req.body.place.pubData._id)
        }]
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