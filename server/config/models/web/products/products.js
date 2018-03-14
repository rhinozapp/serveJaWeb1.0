let mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    objSchema = new mongoose.Schema({
        productID: Schema.ObjectId,
        userID : { type: Schema.ObjectId, required: true, ref : 'userAdmin' },
        categoryID : { type: Schema.ObjectId, required: true, ref : 'category' },
        productName: { type: String, required: true },
        amount : { type: Number, required: true },
        value : { type: Number, required: true },
        promotionValue : { type: Number },
        imgPath : { type: String },
        description: { type: String }
    });

module.exports = mongoose.model('products', objSchema);