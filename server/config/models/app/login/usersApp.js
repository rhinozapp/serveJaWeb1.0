var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let userSchema = new mongoose.Schema({
    userIDFirebase : String,
    email: { type: String, required: true },
    profileApp: { type: Object },
    profileFace: { type: Object }
});

module.exports = mongoose.model('user', userSchema);