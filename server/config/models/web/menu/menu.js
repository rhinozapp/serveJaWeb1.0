let mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    objSchema = new mongoose.Schema({
        menuID: Schema.ObjectId,
        userID : { type: String, required: true},
        menuName : { type: String, required: true},
        productsID : { type: Array }
    });

module.exports = mongoose.model('menu', objSchema);