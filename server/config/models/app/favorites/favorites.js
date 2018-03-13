let mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    objSchema = new mongoose.Schema({
        favoriteID: Schema.ObjectId,
        userID : { type: Schema.ObjectId, required: true, ref : 'userApp'},
        places : [{ type: Schema.ObjectId, ref : 'userAdmin' }]
    });

module.exports = mongoose.model('favorites', objSchema);