let mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    objSchema = new mongoose.Schema({
        productID: Schema.ObjectId,
        userID : { type: String, required: true},
        categoryID : { type: String, required: true },
        productName: { type: String, required: true },
        amount : { type: String, required: true },
        value : { type: String, required: true },
        promotionValue : { type: String },
        imgPath : { type: String }
    });

module.exports = mongoose.model('products', objSchema);