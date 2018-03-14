exports.getListPubsFavorites = function (req, res) {
    let mongoose = require('mongoose'),
        favorites = mongoose.model('favorites');

    favorites.find({
        userID : mongoose.Types.ObjectId(req.body.userID)
    }).populate('places')
        .exec(function(err, favoritesList) {
            if (err) {
                res.json({status: false});
            }else if(!favoritesList){
                res.json({status: false});
            }else if(favoritesList.length === 0){
                res.json({status: false});
            }else{
                res.json({
                    status: true,
                    data : favoritesList[0].places
                })
            }
        });
};