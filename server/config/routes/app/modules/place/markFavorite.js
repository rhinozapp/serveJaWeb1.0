exports.markFavorite = function (req, res) {
    let mongoose = require('mongoose'),
        favorites = mongoose.model('favorites');

    favorites.update({
        userID: req.body.userID
    }, {
        $push : {
            places : req.body.place._id
        }
    }, {
        multi : false,
        upsert: true
    }, function () {
        res.json({status : true});
    });
};