exports.updateHeaderImgProfile = function (req, res) {
    let result = {},
        files = '',
        fileName = '',
        mongoose = require('mongoose'),
        userAdmin = mongoose.model('userAdmin'),
        updateVars = req.body.vars;

    //region If file
    if(req.files.file){
        fileName = req.files.file.path.split('headerImgProfile/');
        files += fileName[1];

        userAdmin.update({
            _id : mongoose.Types.ObjectId(updateVars._id)
        }, {
            headerImgPath : files
        }, {
            multi : false
        }, function (data) {
            res.send(true);
        });
    }else{
        res.send(true);
    }
    //endregion
};