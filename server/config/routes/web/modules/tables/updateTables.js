exports.updateTables = function (req, res) {
    let mongoose = require('mongoose'),
        tables = mongoose.model('tables'),
        fs = require('fs'),
        qr = require('qr-image');

    if(req.body.data.tablesID){
        tables.update({
            _id : req.body.data.tablesID
        }, {
            tableName : req.body.data.tableName
        }, {
            multi : false
        }, function () {
            res.json({status : true});
        });
    }else{
        new tables({
            userID: req.body.id,
            tableName : req.body.data.tableName
        }).save().then(function (data) {
            fs.writeFile('./public/files/qrCodes/'+data._id+'.png', qr.imageSync(String(data._id)), (err) => {
                res.json({status : true});
            });

        }, function (err) {
            console.log(err);
            res.json({status : false});
        });
    }
};