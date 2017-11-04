var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    salt = bcrypt.genSaltSync(10);

let objSchema = new mongoose.Schema({
    profileID: Schema.ObjectId,
    userID : { type: String, required: true, index : {unique : true}},
    zipCode: { type: String, required: true, index : {unique : true}},
    address : { type: String, required: true },
    number : { type: String},
    complement : { type: String},
    neighborhood : { type: String, required: true },
    city : { type: String, required: true },
    uf : { type: String, required: true },
    lat : { type: String, required: true },
    long : { type: String, required: true }
});

module.exports = mongoose.model('userAdminProfile', objSchema);