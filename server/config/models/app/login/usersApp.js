let mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    userSchema = new mongoose.Schema({
        userId : Schema.ObjectId,
        email: { type: String, required: true },
        name : { type: String, required: true },
        photo : { type: String, required: true },
        token : { type: String, required: true },
        idFace : { type: String, required: true }
    });

module.exports = mongoose.model('userApp', userSchema);