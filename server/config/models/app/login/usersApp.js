let mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    userSchema = new mongoose.Schema({
        userId : Schema.ObjectId,
        emailFace: { type: String },
        emailGoogle: { type: String },
        name : { type: String },
        photo : { type: String },
        tokenFace : { type: String },
        tokenGoogle : { type: String },
        idFace : { type: String },
        idGoogle : { type: String }
    });

module.exports = mongoose.model('userApp', userSchema);