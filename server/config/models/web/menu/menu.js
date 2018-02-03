let mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    objSchema = new mongoose.Schema({
        menuID: Schema.ObjectId,
        userID : { type: Schema.ObjectId, required: true, ref : 'userAdmin'},
        menuName : { type: String, required: true},
        productsID : [{ type: Schema.ObjectId, ref : 'products' }]
    });

module.exports = mongoose.model('menu', objSchema);