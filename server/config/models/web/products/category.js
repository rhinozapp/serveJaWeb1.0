let mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    objSchema = new mongoose.Schema({
        categoryID: Schema.ObjectId,
        userID : { type: String, required: true },
        categoryName: { type: String, required: true }
    });

module.exports = mongoose.model('category', objSchema);