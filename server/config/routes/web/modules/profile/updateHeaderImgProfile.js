exports.updateHeaderImgProfile = function (req, res) {
    let result = {},
        files = '',
        fileName = '',
        mongoose = require('mongoose'),
        userProfile = mongoose.model('userAdminProfile'),
        updateVars = req.body.vars;

    //region If file
    if(req.files.file){
        fileName = req.files.file.path.split('headerImgProfile/');
        files += fileName[1];

        userProfile.update({
            userID : updateVars.userID
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