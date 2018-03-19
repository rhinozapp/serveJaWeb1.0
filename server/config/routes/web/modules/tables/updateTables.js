exports.updateTables = function (req, res) {
    let mongoose = require('mongoose'),
        tables = mongoose.model('tables'),
        fs = require('fs'),
        qr = require('qr-image'),
        cloudinary = require('cloudinary');

    tables.findOneAndUpdate({
        userID: mongoose.Types.ObjectId(req.body.id),
        _id : mongoose.Types.ObjectId(req.body.data.tablesID)
    }, {
        tableName : req.body.data.tableName
    }, {
        multi : false,
        upsert : true,
        new : true
    }, function (err, data) {
        if(err){
            res.json({status : false});
        }else if(!req.body.data.tablesID){
            fs.writeFile('./public/files/qrCodes/'+data._id+'.png', qr.imageSync(String(data._id), {size : 10}), (error) => {
                if(error){
                    res.json({status : false});
                }else{
                    cloudinary.v2.uploader.upload('./public/files/qrCodes/'+data._id+'.png', {
                        folder : 'qrCodes'
                    }, function (error, result) {
                        if(error){
                            res.json({status : false});
                        }else{
                            tables.update({
                                _id : mongoose.Types.ObjectId(data._id)
                            }, {
                                qrPath : result.secure_url
                            }, {
                                multi : false
                            }, function (error, data) {
                                if(error) {
                                    res.json({status: false});
                                }else{
                                    res.json({status : true});
                                }
                            });
                        }
                    })
                }
            });
        }else{
            res.json({status : true});
        }
    });

    /*if(req.body.data.tablesID){
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
            fs.writeFile('./public/files/qrCodes/'+data._id+'.png', qr.imageSync(String(data._id), {size : 10}), (err) => {
                res.json({status : true});
            });

        }, function (err) {
            console.log(err);
            res.json({status : false});
        });
    }*/
};