exports.updateHeaderImgProfile = function (req, res) {
    let mongoose = require('mongoose'),
        userAdmin = mongoose.model('userAdmin'),
        cloudinary = require('cloudinary');

    //region If file
    if(req.files.file){
        cloudinary.v2.uploader.upload(req.files.file.path, {
            folder : 'headerImgProfile'
        }, function (err, result) {
            if(err){
                res.send(false);
            }else{
                console.log(result);
                userAdmin.update({
                    _id : mongoose.Types.ObjectId(req.body.vars._id)
                }, {
                    headerImgPath : result.secure_url
                }, {
                    multi : false
                }, function (data) {
                    res.send(false);
                });
            }
        });
    }else{
        res.send(true);
    }
    //endregion
};